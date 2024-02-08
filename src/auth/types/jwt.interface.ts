import { CookieOptions } from 'express';

export interface JwtOptionsType {
  audience: string;
  expiresIn: string;
  issuer: string;
  secret: string;
}

export type JwtCookieParamsType = [string, string, CookieOptions];
