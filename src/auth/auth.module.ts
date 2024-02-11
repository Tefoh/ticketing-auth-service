import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportInterfaceStrategy } from './strategies/passport.interface';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { HashingModule } from '../hashing/hashing.module';
import { SignInController } from './controllers/sign-in/sign-in.controller';
import { SignUpController } from './controllers/sign-up/sign-up.controller';
import { SignOutController } from './controllers/sign-out/sign-out.controller';
import { ConfigModule } from '@nestjs/config';
import { CurrentUserController } from './controllers/current-user/current-user.controller';
import authConfig from './config/auth.config';
import { CurrentUserTransformer } from './transformers/current-user.transformer';
import { SignUpTransformer } from './transformers/sign-up.transformer';
import { SignInTransformer } from './transformers/sign-in.transformer';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    HashingModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
  providers: [
    AuthService,
    UserService,
    {
      useClass: LocalStrategy,
      provide: PassportInterfaceStrategy,
    },
    CurrentUserTransformer,
    SignUpTransformer,
    SignInTransformer,
  ],
  controllers: [
    SignInController,
    SignUpController,
    SignOutController,
    CurrentUserController,
  ],
})
export class AuthModule {}
