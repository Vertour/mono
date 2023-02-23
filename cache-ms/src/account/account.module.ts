import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AppModule } from 'src/app.module';
import { RedisWrapperModule } from 'src/redis-wrapper/redis-wrapper.module';

@Module({
  imports: [forwardRef(() => AppModule), forwardRef(() => RedisWrapperModule)],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
