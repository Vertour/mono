import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AccountAuthenticationType,
  AccountRegistrationType,
  AccountUpdatingType,
  Errors,
  IAccount,
  ISessionLog,
  Service
} from 'bizdo';

@Injectable()
export class AccountService extends Service {
  constructor(@Inject('NATS') protected client: ClientProxy) {
    super()
  }

  async auth(data: AccountAuthenticationType): Promise<{ token: string; user: IAccount }> {
    return await this.clientSend<{ token: string; user: IAccount }>('account-authentication', data, Errors.ServerErrors.AUTH_FAILED, 503);
  }

  async registration(data: AccountRegistrationType): Promise<{ token: string; user: IAccount }> {
    return await this.clientSend<{ token: string; user: IAccount }>('account-registration', data, Errors.ServerErrors.REGISTRATION_FAILED, 503);
  }

  async update(data: AccountUpdatingType): Promise<boolean> {
    return await this.clientSend<boolean>('account-update', data, Errors.ServerErrors.UPDATE_FAILED, 503);
  }

  async logout(data: { uid: string; token: string }): Promise<boolean> {
    return await this.clientSend<boolean>('account-logout', data, Errors.ServerErrors.LOGOUT_FAILED, 503);
  }

  async getUserData(uid: string){
    return await this.clientSend<IAccount>('get-user-by-uid', uid, Errors.ServerErrors.FAILED_TO_GET_USER, 503);
  }

  async isEmailExist(email: string): Promise<boolean>{
    return await this.clientSend<boolean>('is-email-exist', email, Errors.ServerErrors.EMAIL_EXISTENSE_CHECK_FAILED, 503);
  }

  async getSessions(tokens: string[]){
    return await this.clientSend<ISessionLog[]>('get-sessions', tokens, Errors.ServerErrors.GET_SESSION_FAILED, 503);
  }
}
