import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { query, Response, Request } from 'express';
import { StockControlService } from 'src/stock-controls/stock-controls.service';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Public()
  @Post('create')
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Res() res?: Response,
  ) {
    return this.subscriptionsService.create(createSubscriptionDto, res);
  }

  @Public()
  @Get('get-all')
  async findAll(@Query('ownerTel') ownerTel: string, @Res() res: Response) {
    return this.subscriptionsService.findAll(ownerTel, res);
  }

  @Public()
  @Get('get-all-data')
  async findAllData(@Query('ownerTel') ownerTel: string, @Res() res: Response) {
    return this.subscriptionsService.findAllData(ownerTel, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
