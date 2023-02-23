import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { IOrganization, IOrganizationCreate } from 'bizdo';
import { Organization } from 'src/models/organization.model';
import { Role } from 'src/models/role.model';
import { Permission } from 'src/models/permission-constants.model';
import { RolePermission } from 'src/models/role-permission.model';
import { Vacancy } from 'src/models/vacancy.model';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(Organization) private organizationRepository: typeof Organization,
    @InjectModel(Permission) private permissionRepository: typeof Permission,
    @InjectModel(RolePermission) private rolePermissionRepository: typeof RolePermission,
    @InjectModel(Vacancy) private vacancyRepository: typeof Vacancy,
    @Inject('NATS') private client: ClientProxy
  ) {}

  async createOrganization(data: IOrganizationCreate): Promise<IOrganization> {
    const { name, role, vacancy, userUid } = data;
    const transaction = await this.organizationRepository.sequelize.transaction();

    try {
      const newOrganization = (
        await this.organizationRepository.create({ name }, { transaction })
      ).toJSON();

      const newRole = await this.roleRepository.create(
        { ...role, organizationId: newOrganization.id },
        { transaction }
      );

      const allPermissions = (
        await this.permissionRepository.findAll({ attributes: ['id', 'name'] })
      ).map((per) => per.toJSON());

      const bulkCreateRolePermissions = allPermissions.map((per) => ({
        permissionId: per.id,
        roleId: newRole.id
      }));

      await this.rolePermissionRepository.bulkCreate(bulkCreateRolePermissions, { transaction });

      const newVacancy = (
        await this.vacancyRepository.create(
          { ...vacancy, roleId: newRole.id, userUid },
          { transaction }
        )
      ).toJSON();

      await lastValueFrom(
        this.client.send('add-account-organization', {
          uid: userUid,
          organization: {
            id: newOrganization.id,
            name: newOrganization.name,
            permissions: allPermissions
          }
        })
      );

      await transaction.commit();

      return { ...newOrganization, vacancies: [newVacancy] };
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }
}
