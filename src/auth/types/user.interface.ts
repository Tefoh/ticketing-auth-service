import { User } from '../../schemas/user.schema';

export interface UserPayload {
  userId: string;

  email: string;
}

export interface JwtAuthPayload {
  sub: string;

  email: string;
}

export interface CurrentUserResponseType {
  id: string;

  email: string;
}

export interface ResponseUserWithTokenType {
  accessToken: string;
  user: User;
}
