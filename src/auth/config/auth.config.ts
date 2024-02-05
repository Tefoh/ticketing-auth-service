import { registerAs } from '@nestjs/config';

const authConfig = registerAs('authConfig', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN + 'h',
    expiresInSeconds: +process.env.JWT_EXPIRES_IN * 24 * 60 * 1000,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  secureCookie: !!process.env.AUTH_SECURE_COOKIE,
}));

export default authConfig;
