import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IAccountRedisRecord } from 'bizdo';
import { lastValueFrom } from 'rxjs';
import { RedisWrapperService } from 'src/redis-wrapper/redis-wrapper.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly redis: RedisWrapperService,
    @Inject('NATS') private client: ClientProxy
  ) {}

  async addAccountToken({ uid, token }: { uid: string; token: string }): Promise<number> {
    if (!(await this.redis.exists('user_' + uid))) await this.addAccountRedisRecord(uid);

    return await this.redis.arrAppendJSON({
      key: 'user_' + uid,
      path: 'tokens',
      values: [`"${token}"`]
    });
  }

  async getAccountRedisRecordByUid(uid: string): Promise<IAccountRedisRecord> {
    const user: IAccountRedisRecord = (await this.redis.exists('user_' + uid))
      ? await this.redis.getJSON('user_' + uid)
      : await this.addAccountRedisRecord(uid);

    return user;
  }

  async addAccountRedisRecord(uid: string): Promise<IAccountRedisRecord> {
    const data: IAccountRedisRecord = {
      tokens: [],
      ...(await lastValueFrom<Omit<IAccountRedisRecord, 'tokens'>>(
        this.client.send('get-account-data-for-redis', uid)
      ))
    };
    if ((await this.setAccountRedisRecord({ uid, record: data })) == false)
      throw { message: 'Can not record in redis.' };
    return data;
  }

  async setAccountRedisRecord({
    uid,
    record
  }: {
    uid: string;
    record: IAccountRedisRecord;
  }): Promise<boolean> {
    return (await this.redis.setJSON({key: 'user_' + uid, data: record})) === 'OK';
  }

  async addAccountOrganization({
    uid,
    organization
  }: {
    uid: string;
    organization: { id: number; name: string; permissions: { id: number; name: string }[] };
  }): Promise<number> {
    return await this.redis.arrAppendJSON({
      key: 'user_' + uid,
      path: 'organizations',
      values: [JSON.stringify(organization)]
    });
  }

  async authWithToken(token: string): Promise<IAccountRedisRecord | false> {
    const uid = token.substring(0, token.indexOf('.'));
    const user: IAccountRedisRecord = await this.getAccountRedisRecordByUid(uid);
    user['uid'] = uid;
    return user?.tokens.includes(token) ? user : false;
  }

  async accountLogout({ uid, token }: { uid: string; token: string }): Promise<boolean> {
    const tokens: string[] = (await this.getAccountRedisRecordByUid(uid)).tokens;
    const idx = tokens.indexOf(token);

    if (idx == -1) throw { message: 'You do not have active session with dat token!' };

    tokens.splice(idx, 1);
    await this.redis.setJSON({ key: 'user_' + uid, params: 'tokens', data: tokens });

    return true;
  }
}
