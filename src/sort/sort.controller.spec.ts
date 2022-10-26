import { Test, TestingModule } from '@nestjs/testing';
import { SortController } from './sort.controller';
import { SortService } from './sort.service';

describe('SortController', () => {
  let controller: SortController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SortController],
      providers: [SortService],
    }).compile();

    controller = module.get<SortController>(SortController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
