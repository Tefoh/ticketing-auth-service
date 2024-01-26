import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://auth-db-service/nest'),
    ConfigModule.forRoot(),
    AuthModule,
    HashingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
