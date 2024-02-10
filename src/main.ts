import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { HttpExceptionResponseType } from './common/types/exceptions.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/users');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsResponse: HttpExceptionResponseType = {
          message: 'Some fields have issues!',
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {},
        };
        errors.forEach((error) => {
          errorsResponse.errors[error.property] = Object.values(
            error.constraints,
          );
        });

        return new HttpException(
          errorsResponse,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
