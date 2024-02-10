import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { JwtCookieParamsType } from '../../auth/types/jwt.interface';
import { TransformerInterface } from '../interfaces/transformer.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((value) => {
          if (value instanceof TransformerInterface) {
            return value.toArray();
          }

          return value;
        }),
      )
      .pipe(
        map((value) => {
          const response = context.switchToHttp().getResponse<Response>();
          if (value?.['Set-Cookie']) {
            const setCookieParams: JwtCookieParamsType = value['Set-Cookie'];
            response.cookie(...setCookieParams);
            delete value['Set-Cookie'];
          }

          return {
            message: 'Successful!',
            status: response.statusCode,
            data: value?.data ?? value,
          };
        }),
      );
  }
}
