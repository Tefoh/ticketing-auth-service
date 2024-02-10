import { TransformerInterface } from '../../common/interfaces/transformer.interface';
import { User } from '../../schemas/user.schema';
import { CurrentUserResponseType } from '../types/user.interface';

export class CurrentUserTransformer extends TransformerInterface {
  constructor(private readonly user: User) {
    super();
  }

  toArray(): CurrentUserResponseType {
    return {
      id: this.user._id,
      email: this.user.email,
    };
  }
}
