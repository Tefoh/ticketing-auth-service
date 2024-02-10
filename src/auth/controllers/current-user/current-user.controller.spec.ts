import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserController } from './current-user.controller';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';
import { CurrentUserTransformer } from '../../transformers/current-user.transformer';
import { User } from '../../../schemas/user.schema';

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
              _id: 1,
              email: 'test@email.com',
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
        {
          provide: CurrentUserTransformer,
          useValue: {
            toArray: (
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              user: User,
            ) => ({
              id: 1,
              email: 'test@email.com',
            }),
          },
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

    expect(foundedUser.email).toBe(email);
    expect(foundedUser.id).toBe(1);
  });
});
