import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';
import { HashingInterfaceStrategy } from './strategies/hashing.interface';

// TODO
describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashingService,
        {
          provide: HashingInterfaceStrategy,
          useValue: () => ({}),
        },
      ],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
