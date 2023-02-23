import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IAccountRedisRecord } from 'bizdo';
import { RedisWrapperService } from '../redis-wrapper/redis-wrapper.service';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly redis: RedisWrapperService
  ) {}

  @MessagePattern('redis-get')
  async getRedis<T>(key: string): Promise<T> {
    return await this.redis.getJSON<T>(key);
  }

  @MessagePattern('redis-set')
  async setRedis<D>({ key, data }: { key: string; data: D }): Promise<'OK' | null> {
    return await this.redis.setJSON({ key, data });
  }

  @MessagePattern('redis-set-user')
  async setUserRedis<D>({ key, data }: { key: string; data: D }): Promise<'OK' | null> {
    return await this.redis.setJSON({ key: 'user_' + key, data });
  }

  @MessagePattern('redis-get-user')
  async getUserRedis<T>(key: string): Promise<T> {
    return await this.redis.getJSON<T>('user_' + key);
  }

  @MessagePattern('add-account-token')
  async addAccountToken(data: { uid: string; token: string }): Promise<number> {
    return await this.accountService.addAccountToken(data);
  }

  @MessagePattern('add-account-organization')
  async addAccountOrganization(data: {
    uid: string;
    organization: { id: number; name: string; permissions: { id: number; name: string }[] };
  }): Promise<number> {
    return await this.accountService.addAccountOrganization(data);
  }

  @MessagePattern('auth-with-token')
  async authWithToken(token: string): Promise<IAccountRedisRecord | false> {
    return await this.accountService.authWithToken(token);
  }

  @MessagePattern('account-logout')
  async accountLogout(data: { uid: string; token: string }): Promise<boolean> {
    return await this.accountService.accountLogout(data);
  }
}
