import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockControlService } from './stock-controls.service';
import { CreateStockControlDto } from './dto/create-stock-control.dto';
import { UpdateStockControlDto } from './dto/update-stock-control.dto';

@Controller('stock-controls')
export class StockControlsController {
  constructor(private readonly stockControlsService: StockControlService) {}

  //   @Post()
  //   create(@Body() createStockControlDto: CreateStockControlDto) {
  //     return this.stockControlsService.create(createStockControlDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.stockControlsService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.stockControlsService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateStockControlDto: UpdateStockControlDto,
  //   ) {
  //     return this.stockControlsService.update(+id, updateStockControlDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.stockControlsService.remove(+id);
  //   }
}
