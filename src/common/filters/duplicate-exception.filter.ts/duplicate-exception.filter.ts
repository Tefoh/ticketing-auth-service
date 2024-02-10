import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DuplicateException } from '../../exceptions/duplicate.exception';

@Catch(DuplicateException)
export class DuplicateExceptionFilter implements ExceptionFilter {
  catch(exception: DuplicateException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: 'Some fields in form is duplicated!',
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: {
        [exception.field]: [`The ${exception.field} field is duplicated!`],
      },
    });
  }
}
