import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigService } from '@nestjs/config';
import { ApplyFabricTokenService } from './applyFabricToeknService.service';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService, ApplyFabricTokenService],
})
export class PaymentModule {}
