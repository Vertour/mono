import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Errors, IPermission, Service } from 'bizdo';
import { CreateRoleType, GetRolesType, IRole, UpdateRolePermissionsType, UpdateRoleType } from 'bizdo/lib/role/role';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RoleService extends Service {
  constructor(@Inject('NATS') protected client: ClientProxy) {super()}

  async create( data: CreateRoleType ): Promise<IRole> {
    return await this.clientSend<IRole>('create-role', data, Errors.ServerErrors.CREATION_FAILED, 503);
  }

  async get( data: GetRolesType ): Promise<IRole[]> {
    return await this.clientSend<IRole[]>('get-roles', data, Errors.ServerErrors.GET_FAILED, 503);
  }

  async update( data: UpdateRoleType ): Promise<boolean> {
    return await this.clientSend<boolean>('update-role', data, Errors.ServerErrors.UPDATE_FAILED, 503);
  }

  async delete( id: number ): Promise<boolean> {
    return await this.clientSend<boolean>('delete-role', id, Errors.ServerErrors.DELETE_FAILED, 503);
  }

  async updatePermissions( data: UpdateRolePermissionsType ): Promise<boolean> {
    return await this.clientSend<boolean>('update-role-permissions', data, Errors.ServerErrors.UPDATE_FAILED, 503);
  }

  async getPermissionsList(){
    return await this.clientSend<IPermission[]>('get-permissions-list', '', Errors.ServerErrors.GET_FAILED, 503);
  }
}
