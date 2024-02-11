import { User } from '../../schemas/user.schema';
import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { CurrentUserTransformer } from './current-user.transformer';
import { Injectable } from '@nestjs/common';
import { JwtCookieParamsType } from '../types/jwt.interface';

@Injectable()
export class SignInTransformer extends TransformerInterface {
  constructor(private readonly currentUserTransformer: CurrentUserTransformer) {
    super();
  }

  toArray(tokenCookie: JwtCookieParamsType, accessToken: string, user: User) {
    return {
      'Set-Cookie': tokenCookie,
      accessToken,
      user: this.currentUserTransformer.toArray(user),
    };
  }
}
