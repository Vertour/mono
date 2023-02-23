import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import {
  AccountAuthenticationType,
  AccountUpdatingType,
  IAccount,
  IAccountRedisRecord
} from 'bizdo';
import { OnException } from 'src/decorators/exceptions/exception.decorator';
import { SaveSession } from 'src/decorators/sessions/save-session.decorator';
import { AuthGuard } from 'src/guards/authorization.guard';
import { AccountService } from './account.service';
import { AccountRegistrationDto } from './dto/registration.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @SaveSession()
  @OnException({ message: 'Wrong password or emaiil.' })
  @Post('auth')
  async auth(@Body() data: AccountAuthenticationType): Promise<{ token: string; user: IAccount }> {
    return await this.accountService.auth(data);
  }

  @SaveSession()
  @OnException({message: 'Wrong password or email.', status: 504})
  @Post('registration')
  async registration(
    @Body() data: AccountRegistrationDto
  ): Promise<{ token: string; user: IAccount }> {
    return await this.accountService.registration(data);
  }

  
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @Request()
    {
      user,
      token
    }: {
      user: ReturnType<() => { uid: string } & IAccountRedisRecord>;
      token: string;
    }
  ): Promise<boolean> {
    return await this.accountService.logout({ uid: user.uid, token });
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async update(@Request() { user }, @Body() data: AccountUpdatingType): Promise<boolean> {
    return await this.accountService.update({ ...data, uid: user.uid });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getOwnData(@Request() {user}: { user: ReturnType<()=>{uid: string}&IAccountRedisRecord>, token: string }) {
    return await this.accountService.getUserData(user.uid);
  }

  @UseGuards(AuthGuard)
  @Get('/sessions')
  async getSessions(@Request() {user}: { user: ReturnType<()=>{uid: string}&IAccountRedisRecord>, token: string }) {
    return await this.accountService.getSessions(user.tokens);
  }
}
