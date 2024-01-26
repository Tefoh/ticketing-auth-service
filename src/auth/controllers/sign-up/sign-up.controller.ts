import { Controller, Get } from '@nestjs/common';
import { HashingService } from 'src/hashing/hashing.service';

@Controller('sign-up')
export class SignUpController {
  constructor(private readonly hash: HashingService) {}
  @Get()
  index() {
    return this.hash.createPassword('test');
  }
}
