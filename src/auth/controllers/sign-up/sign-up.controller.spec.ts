import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { AuthService } from '../../auth.service';
import { Response } from 'express';

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

  it('should set cookie', async () => {
    const statusResponseMock = {
      send: jest.fn((x) => x),
    };
    const cookieResponseMock = {
      status: jest.fn(() => statusResponseMock),
    };
    const responseMock = {
      cookie: jest.fn(() => cookieResponseMock),
      status: jest.fn(() => statusResponseMock),
      send: jest.fn((x) => x),
    } as unknown as Response;
    const responseSpy = jest.spyOn(responseMock, 'cookie');

    await controller.signUp(
      { email: 'email@example.com', password: 'password' },
      responseMock,
    );

    expect(responseSpy).toHaveBeenCalled();
  });
});
