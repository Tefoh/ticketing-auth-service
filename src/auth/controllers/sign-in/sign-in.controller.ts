import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../decorators/current-user/current-user.decorator';
import { InvalidCredentialsFilter } from '../../filters/invalid-credentials/invalid-credentials.filter';
import { SignInTransformer } from '../../transformers/sign-in.transformer';
import { ResponseUserWithTokenType } from '../../types/user.interface';
import { AuthService } from '../../auth.service';

@Controller('sign-in')
export class SignInController {
  constructor(
    private readonly authService: AuthService,
    private readonly transformer: SignInTransformer,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseFilters(new InvalidCredentialsFilter())
  @UseGuards(AuthGuard('local'))
  async signIn(@CurrentUser() passportPayload: ResponseUserWithTokenType) {
    const { accessToken, user } = passportPayload;

    return this.transformer.toArray(
      this.authService.jwtCookieParams(accessToken),
      accessToken,
      user,
    );
  }
}
