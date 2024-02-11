import { Test, TestingModule } from '@nestjs/testing';
import { SignOutController } from './sign-out.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user/user.service';
import { SignOutTransformer } from '../../transformers/sign-out.transformer';
import { UnauthorizedException } from '@nestjs/common';

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
          useValue: {
            expireJwtCookieParams: () => [
              'access_token',
              'token',
              {
                secure: true,
                httpOnly: true,
                sameSite: 'lax',
                expires: new Date(null),
              },
            ],
          },
        },
        {
          provide: UserService,
          useValue: {
            findUser: (userId: string = '1') => {
              if (userId !== '1') {
                throw new UnauthorizedException();
              }

              return {
                _id: 1,
                email: 'test@email.com',
              };
            },
          },
        },
        SignOutTransformer,
      ],
    }).compile();

    controller = module.get<SignOutController>(SignOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign out user', async () => {
    const email = 'test@email.com';
    const response = await controller.signOut({
      userId: '1',
      email,
    });

    expect(response['Set-Cookie'][0]).toEqual('access_token');
    expect(response['Set-Cookie'][2].expires).toEqual(new Date(null));
  });

  it('should get unauthorized exception if user not logged in', async () => {
    const email = 'test@email.com';
    try {
      await controller.signOut({
        userId: '2',
        email,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
