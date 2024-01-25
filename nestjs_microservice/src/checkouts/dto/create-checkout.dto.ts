import {
  IsNotEmpty,
  IsPositive,
  IsInt,
  ValidateNested,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  product_id: number;
}

export class CreateCheckoutDto {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
