import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout } from './entities/checkout.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

const PRODUCTS_LIST = [
  {
    id: 1,
    name: 'Product 1',
    description: 'This is a product description',
    image_url: 'http://via.placeholder.com/1',
    price: 500,
    category_id: 1,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'This is a product description',
    image_url: 'http://via.placeholder.com/2',
    price: 500,
    category_id: 2,
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'This is a product description',
    image_url: 'http://via.placeholder.com/3',
    price: 500,
    category_id: 3,
  },
  {
    id: 4,
    name: 'Product 4',
    description: 'This is a product description',
    image_url: 'http://via.placeholder.com/4',
    price: 500,
    category_id: 4,
  },
  {
    id: 5,
    name: 'Product 5',
    description: 'This is a product description',
    image_url: 'http://via.placeholder.com/5',
    price: 500,
    category_id: 5,
  },
];

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
    private amqpConnection: AmqpConnection,
  ) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const productIds = createCheckoutDto.items.map((item) => item.product_id);
    const products = PRODUCTS_LIST.filter((product) =>
      productIds.includes(product.id),
    ); // TODO call external microservice
    const checkout = Checkout.create({
      items: createCheckoutDto.items.map((item) => {
        const product = products.find(({ id }) => id === item.product_id);
        return {
          quantity: item.quantity,
          price: product.price,
          product: {
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            product_id: product.id,
            product_url: product.image_url,
          },
        };
      }),
    });

    await this.checkoutRepository.save(checkout);
    await this.amqpConnection.publish('amq.direct', 'checkout.created', {
      checkout_id: checkout.id,
      total: checkout.total,
    });
    return checkout;
  }

  findAll() {
    return this.checkoutRepository.find();
  }

  findOne(id: number) {
    return this.checkoutRepository.findOneByOrFail({ id });
  }

  remove(id: number) {
    return this.checkoutRepository.delete(id);
  }

  async pay(id: number) {
    const checkout = await this.checkoutRepository.findOneByOrFail({ id });
    checkout.pay();
    return this.checkoutRepository.save(checkout);
  }

  async fail(id: number) {
    const checkout = await this.checkoutRepository.findOneByOrFail({ id });
    checkout.cancel();
    return this.checkoutRepository.save(checkout);
  }
}
