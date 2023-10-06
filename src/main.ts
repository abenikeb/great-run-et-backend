import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/log/all.exception';
import { HttpExceptionFilter } from './utils/log/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add Global Pipes--(Class Validator && Class Transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  var corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.setGlobalPrefix('api');

  // app.use(csurf());
  app.use(helmet());
  app.enableCors(corsOptions);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(8000);
}
bootstrap();
