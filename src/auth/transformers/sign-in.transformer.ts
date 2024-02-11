import { User } from '../../schemas/user.schema';
import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { CurrentUserTransformer } from './current-user.transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignInTransformer extends TransformerInterface {
  constructor(private readonly currentUserTransformer: CurrentUserTransformer) {
    super();
  }

  toArray(accessToken: string, user: User) {
    return {
      accessToken,
      user: this.currentUserTransformer.toArray(user),
    };
  }
}
