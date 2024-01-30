import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { AuthService } from '../../auth.service';

// TODO
describe('SignUpController', () => {
  let controller: SignUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController],
      providers: [
        {
          provide: AuthService,
          useValue: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<SignUpController>(SignUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
