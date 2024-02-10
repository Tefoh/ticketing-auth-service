import { User } from '../../schemas/user.schema';
import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { JwtCookieParamsType } from '../types/jwt.interface';
import { CurrentUserTransformer } from './current-user.transformer';

export class SignUpTransformer extends TransformerInterface {
  constructor(
    private readonly tokenCookie: JwtCookieParamsType,
    private readonly accessToken: string,
    private readonly user: User,
  ) {
    super();
  }

  toArray() {
    return {
      'Set-Cookie': this.tokenCookie,
      accessToken: this.accessToken,
      user: new CurrentUserTransformer(this.user).toArray(),
    };
  }
}
