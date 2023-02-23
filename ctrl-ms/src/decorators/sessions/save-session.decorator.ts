import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { SaveSessionInterceptor } from 'src/interceptors/session.interceptor';


export function SaveSession(): MethodDecorator {
    return applyDecorators(
        UseInterceptors(SaveSessionInterceptor),
    );
}