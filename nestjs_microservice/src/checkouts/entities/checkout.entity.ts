import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum CheckoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type CreateCheckoutCommand = {
  items: Array<{
    quantity: number;
    price: number;
    product: {
      product_id: number;
      name: string;
      description: string;
      image_url: string;
      product_url: string;
    };
  }>;
};

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: CheckoutStatus = CheckoutStatus.PENDING;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'],
    eager: true,
  })
  items: CheckoutItem[];

  static create(input: CreateCheckoutCommand) {
    const checkout = new Checkout();
    checkout.items = input.items.map((item) => {
      const checkoutItem = new CheckoutItem();
      checkoutItem.quantity = item.quantity;
      checkoutItem.price = item.price;
      checkoutItem.product = new CheckoutProduct();
      checkoutItem.product.name = item.product.name;
      checkoutItem.product.description = item.product.description;
      checkoutItem.product.image_url = item.product.image_url;
      checkoutItem.product.product_id = item.product.product_id;

      return checkoutItem;
    });

    checkout.total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return checkout;
  }

  pay() {
    if (this.status === CheckoutStatus.FAILED) {
      throw new Error('Checkout failed');
    }

    if (this.status === CheckoutStatus.PAID) {
      throw new Error('Checkout already paid');
    }

    this.status = CheckoutStatus.PAID;
  }

  cancel() {}
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  product_id: number;
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  // @Column({type:'decimal', precision:5, scale:2})
  @Column()
  price: number;

  @ManyToOne(() => Checkout)
  checkout: Relation<Checkout>;

  @ManyToOne(() => CheckoutProduct, { cascade: ['insert'], eager: true })
  product: Relation<CheckoutProduct>;
}
