import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVacanciesType, Errors, GetVacanciesType, IVacancy, Service, UpdateVacancyType } from 'bizdo';

@Injectable()
export class VacancyService extends Service {
  constructor(@Inject('NATS') protected client: ClientProxy) {super()}

  async create( data: CreateVacanciesType ): Promise<IVacancy[]> {
    return await this.clientSend<IVacancy[]>('create-role', data, Errors.ServerErrors.CREATION_FAILED, 503);
  }

  async get( data: GetVacanciesType ): Promise<IVacancy[]> {
    return await this.clientSend<IVacancy[]>('get-roles', data, Errors.ServerErrors.GET_FAILED, 503);
  }

  async update( data: UpdateVacancyType ): Promise<boolean> {
    return await this.clientSend<boolean>('update-role', data, Errors.ServerErrors.UPDATE_FAILED, 503);
  }

  async delete( id: number ): Promise<boolean> {
    return await this.clientSend<boolean>('delete-role', id, Errors.ServerErrors.DELETE_FAILED, 503);
  }
}