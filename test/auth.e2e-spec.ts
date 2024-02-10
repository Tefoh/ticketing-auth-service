import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../src/mongoose-test-module.helper';
import { User } from '../src/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../src/auth/config/auth.config';
import * as cookieParser from 'cookie-parser';
import { AuthService } from '../src/auth/auth.service';
import { DuplicateException } from '../src/common/exceptions/duplicate.exception';
import { Model } from 'mongoose';
import { HashingModule } from '../src/hashing/hashing.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '../src/common/response/response.interceptor';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userMongo: Model<User>;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.testing'],
          load: [authConfig],
        }),
        HashingModule,
        PassportModule,
        JwtModule,
        rootMongooseTestModule(),
        AuthModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseInterceptor,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({ credentials: true, origin: ['http://localhost:3000'] });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    authService = moduleFixture.get<AuthService>(AuthService);
    userMongo = moduleFixture.get('UserModel');

    await app.init();
  });

  afterEach(async () => {
    await closeInMongodConnection();
    await moduleFixture.close();
    await app.close();
  });

  describe('register user (E2E Test)', () => {
    it('/api/users/sign-up (Post)', async () => {
      await request(app.getHttpServer()).post('/sign-up').send({}).expect(400);

      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ email: 'email@example.com', password: 'password' })
        .expect(201);

      const createdToken = await authService.generateToken({
        _id: response.body.data.user.id,
        email: 'email@example.com',
        password: 'password',
      });

      const splittedCookie = response.get('Set-Cookie')[0].split('=');

      expect(response.get('Set-Cookie')).toBeDefined();
      expect(splittedCookie[0]).toEqual('access_token');
      expect(splittedCookie[1].split('; ')[0]).toEqual(createdToken);

      const user = await userMongo.findById(response.body.data.user.id).exec();

      expect(user.id).toEqual(response.body.data.user.id);
      expect(user.email).toEqual(response.body.data.user.email);

      try {
        const signUpResponse = await request(app.getHttpServer())
          .post('/sign-up')
          .send({ email: 'email@example.com', password: 'password' });

        expect(signUpResponse.statusCode).toEqual(422);
      } catch (error) {
        expect(error).toBeInstanceOf(DuplicateException);
        expect(error).toHaveProperty('message', 'Entered email is duplicated.');
      }
    });
  });

  describe('current user (E2E Test)', () => {
    it('/api/users/current-user (GET)', async () => {
      await request(app.getHttpServer()).get('/current-user').expect(401);

      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ email: 'email@example.com', password: 'password' })
        .expect(201);

      const currentUserResponse = await request(app.getHttpServer())
        .get('/current-user')
        .set('Cookie', response.get('Set-Cookie')[0])
        .expect(200);

      expect(currentUserResponse.body.data.email).toEqual('email@example.com');
    });
  });
});
