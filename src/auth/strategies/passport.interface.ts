import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

export abstract class PassportInterfaceStrategy extends PassportStrategy(
  Strategy,
) {
  abstract validate(email: string, password: string): Promise<any>;
}
