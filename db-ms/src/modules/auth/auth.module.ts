import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from 'src/app.module';
import { Password } from 'src/models/password.model';
import { SessionLog } from 'src/models/session-log.model';
import { User } from 'src/models/user.model';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([User, Password, SessionLog]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
