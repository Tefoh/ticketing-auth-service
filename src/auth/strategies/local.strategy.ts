import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportInterfaceStrategy } from './passport.interface';
import { ResponseUserWithTokenType } from '../types/user.interface';

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy)
  implements PassportInterfaceStrategy
{
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<ResponseUserWithTokenType> {
    const { accessToken, user } = await this.authService.signIn(
      email,
      password,
    );

    return {
      accessToken,
      user,
    };
  }
}
