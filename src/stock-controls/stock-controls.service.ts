import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GreenWave, YellowWave } from './entities/stock-control.entity';

@Injectable()
export class StockControlService {
  constructor(
    @InjectRepository(GreenWave)
    private readonly greenWaveRepository: Repository<GreenWave | any>,
    @InjectRepository(YellowWave)
    private readonly yellowWaveRepository: Repository<YellowWave>,
  ) {}

  async checkStockAvailability(color: string, size: string): Promise<boolean> {
    let stockItem;

    if (color === 'green') {
      stockItem = await this.greenWaveRepository.find();
    } else if (color === 'yellow') {
      stockItem = await this.yellowWaveRepository.find();
    }

    if (!stockItem || stockItem[0][size] === 0 || stockItem[0][size] < 0) {
      return false;
    }
    return true;
  }

  async updateStock(color: string, size: string): Promise<void> {
    if (color === 'green') {
      await this.greenWaveRepository
        .createQueryBuilder()
        .update(GreenWave)
        .set({ [size]: () => `${size} - 1` })
        .execute();
    } else if (color === 'yellow') {
      await this.yellowWaveRepository
        .createQueryBuilder()
        .update(YellowWave)
        .set({ [size]: () => `${size} - 1` })
        .execute();
    }
  }
}
