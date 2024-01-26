import { HashingInterfaceStrategy } from './hashing.interface';
import { hash, compare } from 'bcrypt';

class BcryptStrategy implements HashingInterfaceStrategy {
  hash(password: string): Promise<string> {
    return hash(password, 12);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}

export { BcryptStrategy };
