import { Test, TestingModule } from '@nestjs/testing';
import { StockControlsController } from './stock-controls.controller';
import { StockControlsService } from './stock-controls.service';

describe('StockControlsController', () => {
  let controller: StockControlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockControlsController],
      providers: [StockControlsService],
    }).compile();

    controller = module.get<StockControlsController>(StockControlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
