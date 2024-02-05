import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';
import { HashingInterfaceStrategy } from './strategies/hashing.interface';
import { BcryptStrategy } from './strategies/bcrypt.strategy';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashingService,
        {
          provide: HashingInterfaceStrategy,
          useClass: BcryptStrategy,
        },
      ],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a hash and can be compared with original password', async () => {
    const password = 'password';

    const hash = await service.createPassword(password);

    const wrongPasswordResult = await service.checkPassword(
      'random wrong password',
      hash,
    );
    const correctPasswordResult = await service.checkPassword(password, hash);

    expect(wrongPasswordResult).toBe(false);
    expect(correctPasswordResult).toBe(true);
  });
});
