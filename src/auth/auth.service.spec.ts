import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getConfigToken } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { HashingService } from '../hashing/hashing.service';

// TODO
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: () => ({}),
        },
        {
          provide: JwtService,
          useValue: () => ({}),
        },
        {
          provide: HashingService,
          useValue: () => ({}),
        },
        {
          provide: getConfigToken('authConfig'),
          useValue: () => ({}),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
