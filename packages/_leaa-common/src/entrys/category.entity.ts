import { ObjectType, Field } from '@nestjs/graphql';

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
  name!: string | null;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  slug!: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  parent_id!: string | null;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string | null;

  @TreeChildren()
  @Field(() => [Category], { nullable: true })
  children?: Category[] | null;

  @TreeParent()
  @Field(() => Category, { nullable: true })
  parent?: Category | null;

  // Virtual Field (not in DB)
  // @Field(() => String, { nullable: true })
  // key?: string | null;
}
