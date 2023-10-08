import { Test, TestingModule } from '@nestjs/testing';
import { StockControlsService } from './stock-controls.service';

describe('StockControlsService', () => {
  let service: StockControlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockControlsService],
    }).compile();

    service = module.get<StockControlsService>(StockControlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
