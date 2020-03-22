import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Index, Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { Base } from '@leaa/common/src/entrys';

@Entity('categories')
@Index('categories_name_unique', ['name'], { unique: true })
@Index('categories_slug_unique', ['slug'], { unique: true })
@ObjectType()
@Tree('nested-set')
export class Category extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  parent_id!: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @TreeChildren()
  @Field(() => [Category], { nullable: true })
  children?: Category[];

  @TreeParent()
  @Field(() => Category, { nullable: true })
  parent?: Category;

  // Virtual Field (not in DB)
  @Field(() => String, { nullable: true })
  key?: string;
}
