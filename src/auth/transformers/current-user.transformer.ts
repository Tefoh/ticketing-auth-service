import { Injectable } from '@nestjs/common';
import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { User } from '../../schemas/user.schema';
import { CurrentUserResponseType } from '../types/user.interface';

@Injectable()
export class CurrentUserTransformer extends TransformerInterface {
  toArray(user: User): CurrentUserResponseType {
    return {
      id: user._id,
      email: user.email,
    };
  }
}
