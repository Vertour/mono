import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IAccountRedisRecord } from 'bizdo';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('NATS') private client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.substring(
      request.headers.authorization.indexOf(' ') + 1
    );
    request['token'] = token;

    const user = await lastValueFrom<
      Promise<ReturnType<() => { uid: string } & IAccountRedisRecord> | false>
    >(this.client.send('auth-with-token', token));
    
    if (user) request['user'] = user as ReturnType<() => { uid: string } & IAccountRedisRecord>;
    else return false;

    return true;
  }
}

function validateRequest(request: any): boolean | Promise<boolean> | Observable<boolean> {
  throw new Error('Function not implemented.');
}
