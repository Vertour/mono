import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [OrganizationController, VacancyController, RoleController],
  providers: [OrganizationService, VacancyService, RoleService],
  exports: [OrganizationService, VacancyService, RoleService]
})
export class OrganizationModule {}
