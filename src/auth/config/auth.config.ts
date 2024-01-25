import { registerAs } from '@nestjs/config';

const authConfig = registerAs('authConfig', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
}));

export default authConfig;
