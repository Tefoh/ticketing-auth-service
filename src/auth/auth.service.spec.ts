import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getConfigToken } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { JwtAuthPayload } from './types/user.interface';
import { JwtOptionsType } from './types/jwt.interface';
import { User } from '../schemas/user.schema';
import { DuplicateException } from '../common/exceptions/duplicate.exception';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: async (
              email: string = 'email@test.com',
              password: string = 'password',
            ) => {
              if (email === 'duplicated@test.com') {
                throw new DuplicateException('email');
              }

              return {
                _id: 'random_id',
                email,
                password,
              };
            },
            findUserByEmail: async (email: string) => {
              if (email === 'not-found@test.com') {
                return null;
              }

              return {
                _id: 'random_id',
                email,
                password: 'password',
              };
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: async (
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              payload: JwtAuthPayload,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              options: JwtOptionsType,
            ) => {
              return 'accessToken';
            },
          },
        },
        {
          provide: HashingService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            checkPassword: async (password: string, hash: string) =>
              password === 'password',
          },
        },
        {
          provide: getConfigToken('authConfig'),
          useValue: {
            jwt: {
              secret: 'secret',
              audience: 'localhost',
              expiresIn: '1',
              issuer: 'localhost',
              expiresInSeconds: 3600,
            },
            secureCookie: true,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the cookie options', () => {
    const { expires, ...options } = service.cookieOptions();
    expect(options).toEqual({
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    expect(expires.toISOString().split('.')[0]).toEqual(
      new Date(Date.now() + 3600).toISOString().split('.')[0],
    );
  });

  it('should return the JWT cookie params', () => {
    const token = 'accessToken';
    const cookieParams = service.jwtCookieParams(token);

    expect(cookieParams[0]).toEqual('access_token');
    expect(cookieParams[1]).toEqual(token);

    const { expires, ...options } = cookieParams[2];
    expect(options).toEqual({
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    expect(expires.toISOString().split('.')[0]).toEqual(
      new Date(Date.now() + 3600).toISOString().split('.')[0],
    );
  });

  it('should return the JWT options', () => {
    expect(service.jwtOptions()).toEqual({
      audience: 'localhost',
      expiresIn: '1',
      issuer: 'localhost',
      secret: 'secret',
    });
  });

  it('should generate token', async () => {
    const user = new User();
    user._id = 'random_id';
    user.email = 'email@test.com';
    user.password = 'password';

    const token = await service.generateToken(user);

    expect(token).toEqual('accessToken');
  });

  it('should create user', async () => {
    const { accessToken, user } = await service.signUp(
      'email@test.com',
      'password',
    );

    expect(accessToken).toEqual('accessToken');
    expect(user.email).toEqual('email@test.com');
    expect(user.password).toEqual('password');

    try {
      await service.signUp('duplicated@test.com', 'password');
    } catch (error) {
      expect(error).toBeInstanceOf(DuplicateException);
    }
  });

  it('should validate', async () => {
    const user = await service.validateUser('email@test.com', 'password');

    expect(user.email).toEqual('email@test.com');
    expect(user.password).toEqual('password');

    const notFoundUser = await service.validateUser(
      'not-found@test.com',
      'password',
    );

    expect(notFoundUser).toEqual(null);
  });
});
