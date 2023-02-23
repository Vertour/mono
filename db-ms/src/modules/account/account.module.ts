import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from 'src/app.module';
import { Organization } from 'src/models/organization.model';
import { Password } from 'src/models/password.model';
import { User } from 'src/models/user.model';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    SequelizeModule.forFeature([User, Password, Organization])
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
