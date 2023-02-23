import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  IOrganization,
  IOrganizationCreate
} from 'bizdo';
import { AuthGuard } from 'src/guards/authorization.guard';
import { OrganizationService } from './organization.service';

@UseGuards(AuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('create')
  async auth(@Body() data: IOrganizationCreate, @Request() { user }): Promise<IOrganization> {
    return await this.organizationService.create({ userUid: user.uid, ...data });
  }
}
