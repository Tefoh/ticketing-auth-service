import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingService } from '../../hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashService: HashingService,
  ) {}

  async findUser(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashService.createPassword(password);
    return this.userModel.create({
      email,
      password: hashedPassword,
    });
  }
}
