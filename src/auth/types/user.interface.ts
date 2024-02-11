import { User } from '../../schemas/user.schema';
import { JwtCookieParamsType } from './jwt.interface';

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

export interface SignOutResponseType {
  'Set-Cookie': JwtCookieParamsType;
}
