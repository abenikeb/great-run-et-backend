import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Users } from './user/entities/user.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { StockControlsModule } from './stock-controls/stock-controls.module';
import {
  GreenWave,
  YellowWave,
} from './stock-controls/entities/stock-control.entity';
import { PaymentModule } from './payment/payment.module';
import { AuthLoginModule } from './auth-login/auth-login.module';

@Module({
  imports: [
    // Make ConfigModule Global Accepble
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'great_run', // your database name
    //   entities: [Users, Subscription, GreenWave, YellowWave],
    //   synchronize: true, // for dev envirnoment only
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin1234',
      database: 'test', // your database name
      entities: [Users, Subscription, GreenWave, YellowWave],
      synchronize: true, // for dev envirnoment only
    }),
    AuthModule,
    UserModule,
    SubscriptionsModule,
    StockControlsModule,
    PaymentModule,
    AuthLoginModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guard Except public url end point
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'product',
      method: RequestMethod.GET,
    });
  }
}
