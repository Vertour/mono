import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { AccountService } from './account.service';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('get-user-by-uid')
  async getUSerByUid(uid: string) {
    //return await this.accountService.getUserByUid(uid);
  }

  @MessagePattern('get-account-data-for-redis')
  async getAccountDataForRedis(uid: string) {
    return await this.accountService.getAccountDataForRedis(uid);
  }

  @MessagePattern('is-email-exist')
  async isEmailExist(email: string) {
    return await this.accountService.isEmailExist(email);
  }
}
