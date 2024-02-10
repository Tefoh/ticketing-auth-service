import {
  Controller,
  Get,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user/current-user.decorator';
import { UserService } from '../../user/user.service';
import { UserPayload } from '../../types/user.interface';
import { CurrentUserTransformer } from '../../transformers/current-user.transformer';
import { UnauthorizedExceptionFilter } from 'src/auth/filters/unauthorized.exception/unauthorized.exception.filter';

@Controller('current-user')
export class CurrentUserController {
  constructor(
    private readonly userService: UserService,
    private readonly transformer: CurrentUserTransformer,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseFilters(new UnauthorizedExceptionFilter())
  async currentUser(@CurrentUser() user: UserPayload) {
    const foundedUser = await this.userService.findUser(user.userId);

    if (!foundedUser) {
      throw new UnauthorizedException();
    }

    return this.transformer.toArray(foundedUser);
  }
}
