import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model, Query } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/ts-jest';

const mockUser = (
  email = 'email@example.com',
  password = 'password',
  id = 'test uuid',
): User => ({
  email,
  password,
  _id: id,
});

const mockUserDoc = (mock?: Partial<User>): Partial<UserDocument> => ({
  _id: mock._id || 'test uuid',
  email: mock.email || 'email@example.com',
  password: mock.password || 'password',
});

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            email: 'test@email.com',
            password: 'password',
            _id: 'random',
          }),
        ),
      }),
    );

    const findMockUser = mockUser('test@email.com', 'password', 'random');
    const foundedUser = await service.findUser('random');

    expect(foundedUser).toEqual(findMockUser);
  });

  it('should get by email', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            email: 'test@email.com',
            password: 'password',
            _id: 'random',
          }),
        ),
      }),
    );

    const findMockUser = mockUser('test@email.com', 'password', 'random');
    const foundedUser = await service.findUserByEmail('test@email.com');

    expect(foundedUser).toEqual(findMockUser);
  });

  it('should create new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        _id: 'random id',
        email: 'email@test.com',
        password: 'password',
      } as any),
    );

    const newCat = await service.createUser('email@test.com', 'password');

    expect(newCat).toEqual(mockUser('email@test.com', 'password', 'random id'));
  });
});
