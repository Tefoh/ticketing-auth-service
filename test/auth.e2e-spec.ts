import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { rootMongooseTestModule } from '../src/mongoose-test-module.helper';
import { User } from '../src/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../src/auth/config/auth.config';
import * as cookieParser from 'cookie-parser';
import { AuthService } from '../src/auth/auth.service';
import { DuplicateException } from '../src/auth/exceptions/duplicate.exception';
import { Model } from 'mongoose';

describe('SignUpController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userMongo: Model<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          load: [authConfig],
        }),
        // HashingModule,
        // PassportModule,
        // JwtModule,
        rootMongooseTestModule(),
        AuthModule,
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
      await request(app.getHttpServer())
        .post('/sign-up')
        .send({ email: 'email@example.com', password: 'password' });
    } catch (error) {
      expect(error).toBeInstanceOf(DuplicateException);
      expect(error).toHaveProperty('message', 'Entered email is duplicated.');
    }
  });
});
