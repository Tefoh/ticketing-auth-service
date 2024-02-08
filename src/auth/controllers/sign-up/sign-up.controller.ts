import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { SignUpDto } from '../../dto/sign-up.dto';

@Controller('sign-up')
export class SignUpController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async signUp(@Body() signUpDto: SignUpDto) {
    const { accessToken, user } = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );

    return {
      'Set-Cookie': this.authService.jwtCookieParams(accessToken),
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
        },
      },
    };
  }
}
