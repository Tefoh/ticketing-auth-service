import { Test, TestingModule } from '@nestjs/testing';
import { SignOutController } from './sign-out.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user/user.service';
import { SignOutTransformer } from '../../transformers/sign-out.transformer';

describe('SignOutController', () => {
  let controller: SignOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignOutController],
      providers: [
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        SignOutTransformer,
      ],
    }).compile();

    controller = module.get<SignOutController>(SignOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
