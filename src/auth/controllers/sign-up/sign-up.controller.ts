import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../../auth.service';
import { SignUpDto } from '../../dto/sign-up.dto';

@Controller('sign-up')
export class SignUpController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() signUpDto: SignUpDto, @Res() response: Response) {
    const accessToken = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );

    response
      .cookie(...this.authService.jwtCookieParams(accessToken))
      .status(201)
      .send({
        data: {
          accessToken,
        },
      });
  }
}
