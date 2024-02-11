import { Injectable } from '@nestjs/common';
import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { SignOutResponseType } from '../types/user.interface';
import { JwtCookieParamsType } from '../types/jwt.interface';

@Injectable()
export class SignOutTransformer extends TransformerInterface {
  toArray(expiredCookie: JwtCookieParamsType): SignOutResponseType {
    return {
      'Set-Cookie': expiredCookie,
    };
  }
}
