import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { AuthService } from '../../auth.service';

describe('SignUpController', () => {
  let controller: SignUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: () => ({
              accessToken: 'accessToken',
              user: {
                _id: 'random_id',
                email: 'email@example.com',
              },
            }),
            jwtCookieParams: () => [
              'access_token',
              'accessToken',
              {
                secret: 'secret',
              },
            ],
          },
        },
      ],
    }).compile();

    controller = module.get<SignUpController>(SignUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
