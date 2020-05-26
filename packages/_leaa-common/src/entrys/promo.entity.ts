import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/common/src/entrys';

@Entity('promos')
@Index('promos_name_unique', ['name'], { unique: true })
export class Promo extends Base {
  @Column({ type: 'varchar', length: 32 })
  name?: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  amount?: number;

  @Column({ type: 'int', default: 0 })
  quantity?: number;

  @Column({ type: 'int', default: 0 })
  redeemed_quantity?: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    default: 1.0,
    comment: 'trigger amount, including the amount value',
  })
  over_amount?: number;

  @Column({ type: 'text', nullable: true })
  available_product_ids?: string;

  @Column({ type: 'text', nullable: true })
  unavailable_product_ids?: string;

  @Column({ nullable: true })
  start_time?: Date;

  @Column({ nullable: true })
  expire_time?: Date;

  @Column({ type: 'varchar', nullable: true })
  creator_id?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  // Virtual Field (not in DB)

  available?: boolean;
}
