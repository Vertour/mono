import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from 'src/app.module';
import { Organization } from 'src/models/organization.model';
import { Password } from 'src/models/password.model';
import { Permission } from 'src/models/permission-constants.model';
import { RolePermission } from 'src/models/role-permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { Vacancy } from 'src/models/vacancy.model';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    SequelizeModule.forFeature([
      User,
      Password,
      Role,
      RolePermission,
      Vacancy,
      Permission,
      Organization
    ])
  ],
  controllers: [OrganizationController, RoleController, VacancyController],
  providers: [OrganizationService, RoleService, VacancyService]
})
export class OrganizationModule {}
