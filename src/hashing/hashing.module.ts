import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { HashingInterfaceStrategy } from './strategies/hashing.interface';
import { BcryptStrategy } from './strategies/bcrypt.strategy';

@Module({
  providers: [
    HashingService,
    {
      useClass: BcryptStrategy,
      provide: HashingInterfaceStrategy,
    },
  ],
  exports: [HashingService],
})
export class HashingModule {}
