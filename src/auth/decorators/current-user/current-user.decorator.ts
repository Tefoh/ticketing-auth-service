import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from 'src/auth/types/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload | undefined => {
    return ctx.switchToHttp().getRequest()?.user;
  },
);
