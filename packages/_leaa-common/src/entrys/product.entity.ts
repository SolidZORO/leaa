import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { Base, Category, Tag } from '@leaa/common/src/entrys';
import { ProductAttachmentsObject } from '@leaa/common/src/dtos/product';

@Entity('products')
@Index('products_name_unique', ['name'], { unique: true })
@Index('products_serial_unique', ['serial'], { unique: true })
export class Product extends Base {
  @Column({ type: 'varchar', length: 220, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 220, nullable: true, default: null })
  fullname?: string;

  @Column({ type: 'varchar', length: 220, unique: true })
  serial!: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true, default: 0.0 })
  cost_price?: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true, default: 0.0 })
  market_price?: number;

  @Column({ type: 'int', default: 0 })
  status!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @ManyToMany(() => Category)
  @JoinTable()
  brands?: Category[];

  @ManyToMany(() => Category)
  @JoinTable()
  styles?: Category[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags?: Tag[];

  // Virtual Field (not in DB)

  attachments?: ProductAttachmentsObject;
}
