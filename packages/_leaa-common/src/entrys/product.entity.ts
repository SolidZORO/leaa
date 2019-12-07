import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int, Float } from 'type-graphql';

import { Base, Category, Tag } from '@leaa/common/src/entrys';

@Entity('products')
@Index('products_name_unique', ['name'], { unique: true })
@Index('products_serial_unique', ['serial'], { unique: true })
@ObjectType()
export class Product extends Base {
  @Column({ type: 'varchar', length: 220, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ type: 'varchar', length: 220 })
  @Field(() => String)
  fullname?: string;

  @Column({ type: 'varchar', length: 220, unique: true })
  @Field(() => String, { nullable: true })
  serial!: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  price!: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  cost_price?: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  @Field(() => Float)
  original_price?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  status!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  sort!: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  content?: string;

  @ManyToMany(() => Category)
  @JoinTable()
  @Field(() => Category, { nullable: true })
  brand_category?: Category;

  @ManyToMany(() => Category)
  @JoinTable()
  @Field(() => Category, { nullable: true })
  style_category?: Category;

  @ManyToMany(() => Tag)
  @JoinTable()
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
