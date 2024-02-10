import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserController } from './current-user.controller';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';

describe('CurrentUserController', () => {
  let controller: CurrentUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentUserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findUser: () => ({
              data: {
                id: 1,
                email: 'test@email.com',
              },
            }),
          },
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

  it('should get user', async () => {
    const email = 'test@email.com';
    const foundedUser = await controller.currentUser({
      userId: '1',
      email,
    });

    expect(foundedUser.data.email).toBe(email);
    expect(foundedUser.data.id).toBe(1);
  });
});
