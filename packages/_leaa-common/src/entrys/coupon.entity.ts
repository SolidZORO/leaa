import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/common/src/entrys';

@Entity('coupons')
@Index('coupons_code_unique', ['code'], { unique: true })
export class Coupon extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  code?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @Column({ type: 'varchar', length: 32 })
  name?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  amount?: number;

  @Column({ type: 'varchar', nullable: true })
  promo_id?: string;

  @Column({ type: 'varchar', nullable: true })
  promo_code?: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    default: 1.0,
    comment: 'trigger amount, including the amount value',
  })
  over_amount?: number;

  @Column({ type: 'varchar', default: null })
  user_id?: string;

  @Column({ type: 'varchar', nullable: true })
  order_id?: string;

  @Column({ type: 'varchar', nullable: true })
  order_serial?: number;

  @Column({ type: 'text', nullable: true })
  available_product_ids?: string;

  @Column({ type: 'text', nullable: true })
  unavailable_product_ids?: string;

  @Column({ nullable: true })
  start_time?: Date;

  @Column({ nullable: true })
  expire_time?: Date;

  @Column({ type: 'text', nullable: true })
  redeem_method?: string;

  @Column({ type: 'varchar', default: null })
  creator_id?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  // Virtual Field (not in DB)

  available?: boolean;

  canRedeem?: boolean;
}
