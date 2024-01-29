import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthPayload } from 'src/auth/types/user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const token = await this.jwtService.verify<JwtAuthPayload>(
        accessToken,
        this.authService.jwtOptions(),
      );

      request['user'] = { userId: token.sub, email: token.email };

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
