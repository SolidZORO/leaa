import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('coupons')
@Index('coupons_code_unique', ['code'], { unique: true })
@ObjectType()
export class Coupon extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  code?: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  type?: string;

  @Column({ type: 'varchar', length: 32 })
  @Field(() => String)
  name?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  amount?: number;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  promo_id?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  promo_code?: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    default: 1.0,
    comment: 'trigger amount, including the amount value',
  })
  @Field(() => Float)
  over_amount?: number;

  @Column({ type: 'varchar', default: null })
  @Field(() => String, { nullable: true })
  user_id?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  order_id?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  order_serial?: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  available_product_ids?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  unavailable_product_ids?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  start_time?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  expire_time?: Date;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  redeem_method?: string;

  @Column({ type: 'varchar', default: null })
  @Field(() => String, { nullable: true })
  creator_id?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  status?: number;

  // Virtual Field (not in DB)
  @Field(() => Boolean)
  available?: boolean;

  @Field(() => Boolean)
  canRedeem?: boolean;
}
