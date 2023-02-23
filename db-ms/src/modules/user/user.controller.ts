import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { UserService } from './user.service';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-user-by-uid')
  async getUSerByUid(uid: string) {
    const user = (await this.userService.getUser({uid})).toJSON();
    delete user.password;
    return user;
  }
}
