import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { ExceptionInterceptor } from 'src/interceptors/exception.interceptor';
import { CustomEmailvalidation } from 'src/validators/email-validator.pipe';

export function OnException(options: {message?: string, status?: number}): MethodDecorator {
    return applyDecorators(
        UseInterceptors(new ExceptionInterceptor(options)),
    );
}