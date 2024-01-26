import { Injectable } from '@nestjs/common';
import { HashingInterfaceStrategy } from './strategies/hashing.interface';

@Injectable()
export class HashingService {
  constructor(private readonly hashingInterface: HashingInterfaceStrategy) {}

  createPassword(password: string): Promise<string> {
    return this.hashingInterface.hash(password);
  }

  checkPassword(password: string, hash: string): Promise<boolean> {
    return this.hashingInterface.compare(password, hash);
  }
}
