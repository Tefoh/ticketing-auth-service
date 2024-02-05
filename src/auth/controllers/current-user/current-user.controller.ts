import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user/current-user.decorator';
import { UserService } from '../../user/user.service';
import { UserPayload } from '../../types/user.interface';

@Controller('current-user')
export class CurrentUserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  currentUser(@CurrentUser() user: UserPayload) {
    return this.userService.findUser(user.userId);
  }
}
