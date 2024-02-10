import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUser(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  createUser(email: string, password: string): Promise<User> {
    return this.userModel.create({
      email,
      password,
    });
  }
}
