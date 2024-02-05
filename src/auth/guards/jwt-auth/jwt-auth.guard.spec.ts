import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from '../../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { getConfigToken } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let jwtService: JwtService;
  let authService: AuthService;

  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: AuthService,
          useValue: {
            jwtOptions: () => ({
              secret: 'secret',
            }),
          },
        },
        { provide: UserService, useValue: () => ({}) },
        {
          provide: getConfigToken('authConfig'),
          useValue: () => ({}),
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);

    jwtAuthGuard = new JwtAuthGuard(jwtService, authService);
  });
  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  it('should throw error if the access token cookie is not present', async () => {
    const mockExecutionContext = createMock<ExecutionContext>();

    try {
      await jwtAuthGuard.canActivate(mockExecutionContext);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error).toHaveProperty('message', 'Unauthorized');
    }
  });

  it('should add user payload to request if the JWT token is valid token', async () => {
    const accessToken = await jwtService.sign(
      { sub: 1, email: 'email@test.com' },
      authService.jwtOptions(),
    );

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            access_token: accessToken,
          },
        }),
      }),
    });

    await jwtAuthGuard.canActivate(mockExecutionContext);
  });
});
