import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { catchError } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

export class ExceptionInterceptor implements NestInterceptor {
  constructor(private options?: { message?: string, status?: number }) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {

        if(error instanceof HttpException)
        throw error;

        const message = this.options?.message || error?.message || 'Unhandled exception.';
        const status = this.options?.status || error?.status || 500;
        throw new HttpException(message,  status);
      }),
    );
  }
}
