import { Controller, UseFilters } from '@nestjs/common';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { AuthService } from './auth.service';
import { AccountAuthenticationType, AccountRegistrationType, AccountUpdatingType, IAccount, ISessionLog } from 'bizdo';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '../../models/user.model';
import { SessionLog } from 'src/models/session-log.model';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('account-registration')
  async registration(user: AccountRegistrationType): Promise<{ token: string; user: User }> {
    return await this.authService.accountRegistration(user);
  }

  @MessagePattern('account-authentication')
  async auth(user: AccountAuthenticationType): Promise<{ token: string; user: IAccount }> {
    return await this.authService.accountAuthentication(user);
  }

  @MessagePattern('account-update')
  async accountUpdate(data: AccountUpdatingType): Promise<boolean> {
    return await this.authService.accountUpdate(data);
  }

  @MessagePattern('save-session-log')
  async saveSessionLog(data: ISessionLog): Promise<ISessionLog> {
    return await this.authService.saveSessionLog(data);
  }

  @MessagePattern('get-sessions')
  async getSessions(tokens: string[]): Promise<ISessionLog[]> {
    return await this.authService.getSessions(tokens);
  }
}
