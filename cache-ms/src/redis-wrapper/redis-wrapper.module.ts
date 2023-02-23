import { forwardRef, Module } from '@nestjs/common';
import { RedisWrapperService } from './redis-wrapper.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [],
  providers: [RedisWrapperService],
  exports: [RedisWrapperService]
})
export class RedisWrapperModule {}
