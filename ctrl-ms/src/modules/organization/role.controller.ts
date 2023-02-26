import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IPermission } from 'bizdo';
import { CreateRoleType, GetRolesType, IRole, UpdateRolePermissionsType, UpdateRoleType } from 'bizdo/lib/role/role';
import { AuthGuard } from 'src/guards/authorization.guard';
import { RoleService } from './role.service';

@UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async create(@Body() data: CreateRoleType): Promise<IRole> {
    return await this.roleService.create(data);
  }

  @Post('get')
  async get(@Body() data: GetRolesType): Promise<IRole[]> {
    return await this.roleService.get(data);
  }

  @Post('update')
  async update(@Body() data: UpdateRoleType): Promise<boolean> {
    return await this.roleService.update(data);
  }

  @Post('delete')
  async delete(@Body() {id}: {id:number}): Promise<boolean> {
    return await this.roleService.delete(id);
  }

  @Post('update/permissions')
  async updatePermissions(@Body() data: UpdateRolePermissionsType): Promise<boolean> {
    return await this.roleService.updatePermissions(data);
  }

  @Get('permissions')
  async getPermissionsList(): Promise<IPermission[]> {
    return await this.roleService.getPermissionsList();
  }
}