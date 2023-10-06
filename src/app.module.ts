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
import { SubCategoriesModule } from './sub_categories/sub_categories.module';

@Module({
  imports: [
    // Make ConfigModule Global Accepble
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: '', // your database name
      entities: [Users],
      synchronize: true, // for dev envirnoment only
    }),
    AuthModule,
    UserModule,
    SubCategoriesModule,
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
