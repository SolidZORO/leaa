import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('promos')
@Index('promos_name_unique', ['name'], { unique: true })
@ObjectType()
export class Promo extends Base {
  @Column({ type: 'varchar', length: 32 })
  @Field(() => String)
  name?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  amount?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  quantity?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  redeemed_quantity?: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, comment: 'trigger amount, including the amount value' })
  @Field(() => Float)
  over_amount?: number;

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

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  creator_id?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  status?: number;

  // Virtual Field (not in DB)
  @Field(() => Boolean)
  available?: boolean;
}
