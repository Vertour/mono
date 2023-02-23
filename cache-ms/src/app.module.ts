import { Module } from '@nestjs/common';
import { RedisModule } from 'ioredis-9.0';
import { AppService } from './app.service';
import { RedisWrapperModule } from './redis-wrapper/redis-wrapper.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountModule } from './account/account.module';

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
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number.parseInt(process.env.REDIS_PORT)
        //password: process.env.REDIS_PASSWORD
      }
    }),
    RedisWrapperModule,
    AccountModule
  ],
  providers: [AppService],
  exports: [RedisModule, ClientsModule]
})
export class AppModule {}
