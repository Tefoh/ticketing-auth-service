import { Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../decorators/current-user/current-user.decorator';
import { InvalidCredentialsFilter } from '../../filters/invalid-credentials/invalid-credentials.filter';
import { SignInTransformer } from '../../transformers/sign-in.transformer';
import { ResponseUserWithTokenType } from '../../types/user.interface';

@Controller('sign-in')
export class SignInController {
  constructor(private readonly transformer: SignInTransformer) {}

  @Post()
  @UseFilters(new InvalidCredentialsFilter())
  @UseGuards(AuthGuard('local'))
  async signIn(@CurrentUser() passportPayload: ResponseUserWithTokenType) {
    return this.transformer.toArray(
      passportPayload.accessToken,
      passportPayload.user,
    );
  }
}
