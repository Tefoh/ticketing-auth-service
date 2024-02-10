import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { SignUpDto } from '../../dto/sign-up.dto';
import { DuplicateExceptionFilter } from '../../../common/filters/duplicate-exception.filter.ts/duplicate-exception.filter';
import { SignUpTransformer } from '../../transformers/sign-up.transformer';

@Controller('sign-up')
export class SignUpController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new DuplicateExceptionFilter())
  async signUp(@Body() signUpDto: SignUpDto) {
    const { accessToken, user } = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );

    return new SignUpTransformer(
      this.authService.jwtCookieParams(accessToken),
      accessToken,
      user,
    );
  }
}
