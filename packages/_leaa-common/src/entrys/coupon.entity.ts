import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('coupons')
@Index('coupons_code_unique', ['code'], { unique: true })
@ObjectType()
export class Coupon extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  public code?: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  public type?: string;

  @Column({ type: 'varchar', length: 32 })
  @Field(() => String)
  public slug?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  public amount?: number;

  @Column({ type: 'int' })
  @Field(() => Int, { nullable: true })
  public promo_id?: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  public promo_code?: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, comment: 'trigger amount, including the amount value' })
  @Field(() => Float)
  public over_amount?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public user_id?: number;

  @Column({ type: 'int' })
  @Field(() => Int, { nullable: true })
  public order_id?: number;

  @Column({ type: 'varchar' })
  @Field(() => String, { nullable: true })
  public order_serial?: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String)
  public available_product_ids?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String)
  public unavailable_product_ids?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public start_time?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public expire_time?: Date;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public convert_method?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public creator_id?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  public status?: number;
}
