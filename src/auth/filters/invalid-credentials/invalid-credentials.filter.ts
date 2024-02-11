import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsException } from '../../exceptions/invalid-credentials.exceptions';

@Catch(InvalidCredentialsException)
export class InvalidCredentialsFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: 'Failed!',
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: {
        email: ['Entered credentials is invalid!'],
      },
    });
  }
}
