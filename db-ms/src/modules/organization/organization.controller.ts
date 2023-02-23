import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IOrganization, IOrganizationCreate } from 'bizdo';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { OrganizationService } from './organization.service';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @MessagePattern('create-organization')
  async createOrganization(data: IOrganizationCreate): Promise<IOrganization> {
    return await this.organizationService.createOrganization(data);
  }
}
