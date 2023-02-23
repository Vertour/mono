import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ISessionLog } from 'bizdo';
import { lastValueFrom, tap } from 'rxjs';


export interface Response<T> {
  data: T;
}

@Injectable()
export class SaveSessionInterceptor implements NestInterceptor {
  constructor(@Inject('NATS') private client: ClientProxy) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(
        (data)=>{
          const res = context.switchToHttp().getResponse();
          res.on('finish', async ()=>{
            await lastValueFrom<ISessionLog>(
              this.client.send('save-session-log', { token: data.token, userUid: data.user.uid, data: { host: res.req.hostname, agent: res.req.headers['user-agent'] }})
            ).catch(err=>console.log(err))
          });
        })
    );
  }
}