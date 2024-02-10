import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      message: 'You are not authenticated!',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
