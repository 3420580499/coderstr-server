import { Test, TestingModule } from '@nestjs/testing';
import { SortService } from './sort.service';

describe('SortService', () => {
  let service: SortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SortService],
    }).compile();

    service = module.get<SortService>(SortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
