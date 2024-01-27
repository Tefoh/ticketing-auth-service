import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { PassportInterfaceStrategy } from './passport.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements PassportInterfaceStrategy
{
  constructor(
    @Inject(authConfig)
    authConfiguration: ConfigType<typeof authConfig>,
  ) {
    const secret = authConfiguration.jwt.secret;
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }

  private static extractJWTFromCookie(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}
