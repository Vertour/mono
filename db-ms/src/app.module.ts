import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { SessionLog } from './models/session-log.model';
import { Password } from './models/password.model';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { Permission } from './models/permission-constants.model';
import { RolePermission } from './models/role-permission.model';
import { Role } from './models/role.model';
import { Vacancy } from './models/vacancy.model';
import { Organization } from './models/organization.model';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true }),
    ClientsModule.register([
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: {
          servers: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`,
          pass: process.env.BROKER_PASSWORD,
          user: process.env.BROKER_USER
        }
      }
    ]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
      models: [
        Password,
        SessionLog,
        User,
        SessionLog,
        Permission,
        RolePermission,
        Role,
        Vacancy,
        Organization
      ]
    }),
    AccountModule,
    AuthModule,
    OrganizationModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule, SequelizeModule]
})
export class AppModule {}
