export interface UserPayload {
  userId: string;

  email: string;
}

export interface JwtAuthPayload {
  sub: string;

  email: string;
}

export interface CurrentUserResponseType {
  data: {
    id: string;

    email: string;
  };
}
