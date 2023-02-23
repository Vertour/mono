import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import sequelize from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Password } from 'src/models/password.model';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AccountRegistrationType, AccountAuthenticationType, AccountUpdatingType, IAccount, ISessionLog } from 'bizdo';
import { UserService } from '../user/user.service';
import { SessionLog } from 'src/models/session-log.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Password) private passwordRepository: typeof Password,
    @InjectModel(SessionLog) private sessionLogRepository: typeof SessionLog,
    @Inject('NATS') private client: ClientProxy,
    private readonly userService: UserService
  ) {}

  async accountRegistration(
    data: Omit<AccountRegistrationType, 'uid'>
  ): Promise<{ token: string; user: User }> {
    const { password, ...user } = data;
    const salt: string = await bcrypt.genSalt();
    const [hash, transaction]: [string, sequelize.Transaction] = await Promise.all([
      bcrypt.hash(password as string, salt),
      this.userRepository.sequelize.transaction()
    ]);

    try {
      const createdUser: User = await this.userRepository.create(user, {
        transaction
      });
      const newPassword: Password = this.passwordRepository.build({
        userUid: createdUser.uid,
        hash,
        salt
      });
      await newPassword.save({ transaction });
      await transaction.commit();

      const token = await this.getAuthToken(createdUser.uid);

      return { token, user: createdUser.toJSON() };
    } catch (error) {
      console.log(error);
      transaction.rollback();
      throw error;
    }
  }

  async accountAuthentication({
    email,
    password,
  }: AccountAuthenticationType): Promise<{ token: string; user: IAccount }> {
    const user: User = await this.userService.getUser({email})

    const isAuth = (await bcrypt.hash(password, user.password.salt)) == user.password.hash;

    if (isAuth) {
      const token = await this.getAuthToken(user.uid);
      const response = { token, user: user.toJSON() };
      delete response.user.password;

      return response;
    }

    throw { message: 'Auth false' };
  }

  async accountUpdate(data: AccountUpdatingType): Promise<boolean> {
    const { uid, ...update } = data;
    const [updatedCount] = await this.userRepository.update(update, { where: { uid } });

    return !!updatedCount;
  }

  async getAuthToken(uid: string): Promise<string> {
    const token = uid + '.' + (await bcrypt.hash(await bcrypt.genSalt(), await bcrypt.genSalt()));//remake this shit

    return token;
  }

  async saveSessionLog(data: ISessionLog){
    const transaction =  await this.sessionLogRepository.sequelize.transaction();
    try{
      console.log(data)
      const log: ISessionLog = (await this.sessionLogRepository.create(data, {transaction})).toJSON();
      await lastValueFrom<number>(
        this.client.send('add-account-token', {
          uid: data.userUid,
          token: data.token
        })
      );
      await transaction.commit()
      return log;
    }
    catch(err){
      console.log(err)
      await transaction.rollback();
    }
  }

  async getSessions(tokens: string[]){
    const logs: ISessionLog[] = (await this.sessionLogRepository.findAll({where: {token: tokens},attributes: ['data', 'token', 'userUid']}));
    return logs;
  }


}
