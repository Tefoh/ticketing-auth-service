import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { AuthService } from '../../auth.service';
import { SignUpTransformer } from '../../transformers/sign-up.transformer';
import { JwtCookieParamsType } from '../../types/jwt.interface';
import { User } from '../../../schemas/user.schema';

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
        {
          provide: SignUpTransformer,
          useValue: {
            toArray: (
              tokenCookie: JwtCookieParamsType,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              accessToken: string,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              user: User,
            ) => ({
              'Set-Cookie': tokenCookie,
              accessToken: 'accessToken',
              user: {
                id: 'random_id',
                email: 'email@example.com',
              },
            }),
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
