import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserController } from './current-user.controller';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';

// TODO
describe('CurrentUserController', () => {
  let controller: CurrentUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentUserController],
      providers: [
        {
          provide: UserService,
          useValue: () => ({}),
        },
        {
          provide: JwtService,
          useValue: () => ({}),
        },
        {
          provide: AuthService,
          useValue: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<CurrentUserController>(CurrentUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
