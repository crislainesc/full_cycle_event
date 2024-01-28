import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'checkout.created',
    queue: 'payments',
  })
  async consume(msg: { checkout_id: number; total: number }) {
    try {
      await this.sleep(20000);
      console.log(msg);
    } catch (error) {
      return new Nack(true);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
