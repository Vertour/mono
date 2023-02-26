import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ISearch } from 'bizdo';
import { Role } from 'src/models/role.model';
import { Vacancy } from 'src/models/vacancy.model';
import { Op, literal } from 'sequelize';
import { CreateRoleType, GetRolesType, UpdateRolePermissionsType, UpdateRoleType } from 'bizdo/lib/role/role';
import { Permission } from 'src/models/permission-constants.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(Permission) private permissionRepository: typeof Permission,
  ) {}

  async createRole({ permissions, ...role }: CreateRoleType): Promise<Role>{
    const transaction = await this.roleRepository.sequelize.transaction();
    try{
      const newRole = await this.roleRepository.create(role, {transaction});
      await newRole.$set('permissions', permissions, {transaction});
      await newRole.save({transaction});
      await transaction.commit();
      return newRole;
    }catch(error){
      await transaction.rollback();
      throw error;
    } 
  }

  async updateRole({name, id}: UpdateRoleType){
    return await this.roleRepository.update({name}, {where: {id}})?true:false;
  }

  async updateRolePermissions({id, permissions}: UpdateRolePermissionsType): Promise<boolean>{
    const transaction = await this.roleRepository.sequelize.transaction();
    try{
      const role = await this.roleRepository.findByPk(id, { transaction, lock: transaction.LOCK.KEY_SHARE });
      await role.$set('permissions', permissions, {transaction});
      await transaction.commit();
      return true;
    }catch(error){
      await transaction.rollback();
      throw error;
    } 
  }

  async deleteRole(id: number){
    return await this.roleRepository.destroy({where: {id}})
  }

  async getRoles({ organizationId, search, ...searchParams }: GetRolesType) {
    return await this.roleRepository.findAll({
      where: search?{
        organizationId,
        name: {[Op.iLike]:`%${search}%`},
      }: { organizationId },
      include: [{
        model: Vacancy,
        attributes: []
      }],
      attributes: [
        'id', 
        'organization_id', 
        'name', 
        [literal('count("vacancies"."id")'), 'vacancies_amount'], 
        [literal('count(DISTINCT "vacancies"."user_uid")'), 'employees_amount'],
        [literal('(SELECT COALESCE(array_agg("role_permissions"."permission_id"), ARRAY[]::INTEGER[]) FROM role_permissions as "role_permissions" WHERE role_permissions.role_id = "Role"."id")'), 'permissions']
      ],
      subQuery: false,
      group: ["Role.id", "Role.name"],
      ...searchParams
    });
  }

  async getPermissionsList(){
    return await this.permissionRepository.findAll();
  }

  
}