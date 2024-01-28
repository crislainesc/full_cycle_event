import { Module } from '@nestjs/common';
import { PaymentConsumer } from './payment.consumet';

@Module({
  providers: [PaymentConsumer],
})
export class PaymentsModule {}
