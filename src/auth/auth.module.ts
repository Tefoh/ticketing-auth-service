import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportInterfaceStrategy } from './strategies/passport.interface';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    UserService,
    {
      useClass: LocalStrategy,
      provide: PassportInterfaceStrategy,
    },
  ],
})
export class AuthModule {}
