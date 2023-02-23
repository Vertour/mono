import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ExceptionInterceptor } from 'src/interceptors/exception.interceptor';
import { SaveSessionInterceptor } from 'src/interceptors/session.interceptor';
import { CustomEmailvalidation } from 'src/validators/email-validator.pipe';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';


@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [AccountController],
  providers: [AccountService, CustomEmailvalidation, ExceptionInterceptor, SaveSessionInterceptor],
  exports: [AccountService]
})
export class AccountModule {}
