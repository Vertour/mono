import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IOrganization, IOrganizationCreate } from 'bizdo';
import { CreateRoleType, GetRolesType, UpdateRolePermissionsType, UpdateRoleType } from 'bizdo/lib/role/role';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { Role } from 'src/models/role.model';
import { RoleService } from './role.service';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('create-role')
  async createRole(data: CreateRoleType): Promise<Role> {
    return await this.roleService.createRole(data);
  }

  @MessagePattern('get-roles')
  async getRoles(data: GetRolesType): Promise<Role[]> {
    return await this.roleService.getRoles(data);
  }

  @MessagePattern('update-role')
  async updateRole(data: UpdateRoleType): Promise<boolean> {
    return await this.roleService.updateRole(data);
  }

  @MessagePattern('update-role-permissions')
  async updateRolePermissions(data: UpdateRolePermissionsType): Promise<boolean> {
    return await this.roleService.updateRolePermissions(data);
  }

  @MessagePattern('delete-role')
  async deleteRole(id: number): Promise<number> {
    return await this.roleService.deleteRole(id);
  }

  @MessagePattern('get-permissions-list')
  async getPermissionsList(){
    return await this.roleService.getPermissionsList();
  }
}
