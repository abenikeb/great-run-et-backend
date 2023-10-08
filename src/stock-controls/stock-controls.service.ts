// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// // import { GreenWave, YellowWave } from './wave.entity';

// @Injectable()
// export class StockControlService {
//   constructor(
//     @InjectRepository(GreenWave)
//     private readonly greenWaveRepository: Repository<GreenWave>,
//     @InjectRepository(YellowWave)
//     private readonly yellowWaveRepository: Repository<YellowWave>,
//   ) {}

//   async checkStockAvailability(
//     productId: number,
//     size: string,
//     wave: string,
//   ): Promise<boolean> {
//     let stockItem;

//     if (wave === 'Green') {
//       stockItem = await this.greenWaveRepository.findOne({ where: { size } });
//     } else if (wave === 'Yellow') {
//       stockItem = await this.yellowWaveRepository.findOne({ where: { size } });
//     }

//     return stockItem && stockItem[productId] > 0;
//   }

//   async updateStock(
//     productId: number,
//     size: string,
//     wave: string,
//   ): Promise<void> {
//     let stockItem;

//     if (wave === 'Green') {
//       stockItem = await this.greenWaveRepository.findOne({ where: { size } });
//       stockItem[productId] -= 1;
//     } else if (wave === 'Yellow') {
//       stockItem = await this.yellowWaveRepository.findOne({ where: { size } });
//       stockItem[productId] -= 1;
//     }

//     await stockItem.save();
//   }
// }
