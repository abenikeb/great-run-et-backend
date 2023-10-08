import { PartialType } from '@nestjs/mapped-types';
import { CreateStockControlDto } from './create-stock-control.dto';

export class UpdateStockControlDto extends PartialType(CreateStockControlDto) {}
