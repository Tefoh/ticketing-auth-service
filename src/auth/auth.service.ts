import { Inject, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/schemas/user.schema';
import { CookieOptions } from 'express';
import { DuplicateException } from './exceptions/duplicate.exception';
import { JwtAuthPayload } from './types/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async signUp(email: string, password: string): Promise<string> {
    try {
      const user = await this.usersService.createUser(email, password);

      return this.generateToken(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateException('Entered email is duplicated.');
      }
    }
  }

  private generateToken(user: User): Promise<string> {
    const payload: JwtAuthPayload = { sub: user._id, email: user.email };

    const options = this.jwtOptions();

    return this.jwtService.signAsync(payload, options);
  }

  jwtOptions() {
    return {
      audience: this.authConfiguration.jwt.audience,
      expiresIn: this.authConfiguration.jwt.expiresIn,
      issuer: this.authConfiguration.jwt.issuer,
      secret: this.authConfiguration.jwt.secret,
    };
  }

  jwtCookieParams(accessToken: string): [string, string, CookieOptions] {
    return ['access_token', accessToken, this.cookieOptions()];
  }

  cookieOptions(): CookieOptions {
    return {
      secure: this.authConfiguration.secureCookie,
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(
        Date.now() + this.authConfiguration.jwt.expiresInSeconds,
      ),
    };
  }
}
