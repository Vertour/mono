import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
