import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserController } from './current-user.controller';

describe('CurrentUserController', () => {
  let controller: CurrentUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentUserController],
    }).compile();

    controller = module.get<CurrentUserController>(CurrentUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
