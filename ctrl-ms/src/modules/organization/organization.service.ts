import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { IOrganization, IOrganizationCreate } from 'bizdo';

@Injectable()
export class OrganizationService {
  constructor(@Inject('NATS') private client: ClientProxy) {}

  async create(
    data: ReturnType<() => IOrganizationCreate & { userUid: string }>
  ): Promise<IOrganization> {
    return await lastValueFrom<IOrganization>(this.client.send('create-organization', data));
  }
}
