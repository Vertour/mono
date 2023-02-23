import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AccountController } from './modules/account/account.controller';
import { AccountModule } from './modules/account/account.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CustomEmailvalidation } from './validators/email-validator.pipe';

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
    AccountModule,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AccountController);
  }
}
