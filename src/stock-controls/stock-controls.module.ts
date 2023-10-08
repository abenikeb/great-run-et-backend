import { Module } from '@nestjs/common';
import { StockControlService } from './stock-controls.service';
import { StockControlsController } from './stock-controls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreenWave, YellowWave } from './entities/stock-control.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GreenWave, YellowWave])],
  controllers: [StockControlsController],
  providers: [StockControlService],
  exports: [StockControlService],
})
export class StockControlsModule {}
