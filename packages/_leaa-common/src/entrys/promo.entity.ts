import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('promos')
@Index('promos_name_unique', ['name'], { unique: true })
@ObjectType()
export class Coupon extends Base {
  @Column({ type: 'varchar', length: 32 })
  @Field(() => String)
  public name?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  public amount?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public quantity?: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, comment: 'trigger amount, including the amount value' })
  @Field(() => Float)
  public over_amount?: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public available_product_ids?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public unavailable_product_ids?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public start_time?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public expire_time?: Date;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public creator_id?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  public status?: number;

  // Virtual Field (not in DB)
  @Field(() => Boolean)
  public available?: boolean;
}
