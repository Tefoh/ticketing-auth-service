import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user/current-user.decorator';
import { UnauthorizedExceptionFilter } from '../../filters/unauthorized.exception/unauthorized.exception.filter';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { SignOutTransformer } from '../../transformers/sign-out.transformer';
import { UserPayload } from '../../types/user.interface';
import { UserService } from '../../user/user.service';
import { AuthService } from '../../auth.service';

@Controller('sign-out')
export class SignOutController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly transformer: SignOutTransformer,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseFilters(new UnauthorizedExceptionFilter())
  async signOut(@CurrentUser() user: UserPayload) {
    const foundedUser = await this.userService.findUser(user.userId);

    if (!foundedUser) {
      throw new UnauthorizedException();
    }

    return this.transformer.toArray(this.authService.expireJwtCookieParams());
  }
}
