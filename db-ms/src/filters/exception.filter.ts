import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
  ExceptionFilter
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionFilterMs implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log(exception);
    return new Observable((subscriber) => {
      subscriber.error(new HttpException(exception.message, 503));
    });
  }
}
