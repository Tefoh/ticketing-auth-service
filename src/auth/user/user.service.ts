import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findUser(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  createUser(email: string, password: string): Promise<User> {
    return this.userModel.create({
      email,
      password,
    });
  }
}
