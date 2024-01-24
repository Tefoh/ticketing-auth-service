import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/users')
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('/api/users/login')
  async login(@Request() req) {
    return req.user;
  }
}
