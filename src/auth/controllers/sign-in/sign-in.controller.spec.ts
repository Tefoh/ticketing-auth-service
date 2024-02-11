import { Test, TestingModule } from '@nestjs/testing';
import { SignInController } from './sign-in.controller';
import { SignInTransformer } from '../../transformers/sign-in.transformer';
import { CurrentUserTransformer } from '../../transformers/current-user.transformer';
import { AuthService } from '../../auth.service';

describe('SignInController', () => {
  let controller: SignInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignInController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: (
              email: string = 'test@email.com',
              password: string = 'password',
            ) => ({
              email,
              password,
            }),
          },
        },
        SignInTransformer,
        CurrentUserTransformer,
      ],
    }).compile();

    controller = module.get<SignInController>(SignInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user', async () => {
    const email = 'test@email.com';
    const accessToken = 'accessToken';
    const foundedUser = await controller.signIn({
      accessToken,
      user: {
        _id: '1',
        email,
        password: 'password',
      },
    });

    expect(foundedUser.user.email).toBe(email);
    expect(foundedUser.user.id).toBe('1');
  });
});
