export interface UserPayload {
  userId: string;

  email: string;
}

export interface JwtAuthPayload {
  sub: string;

  email: string;
}
