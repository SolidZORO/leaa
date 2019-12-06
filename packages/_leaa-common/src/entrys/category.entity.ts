import { ObjectType, Field, Int } from 'type-graphql';

import {
  Index,
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
} from 'typeorm';

import { Base } from '@leaa/common/src/entrys';

@Entity('categories')
@Index('categories_name_unique', ['name'], { unique: true })
@Index('categories_slug_unique', ['slug'], { unique: true })
@ObjectType()
@Tree('nested-set')
export class Category extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  slug!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
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

  // @Field(() => Int, { nullable: true })
  // parentId?: number;

  // @Column({ type: 'int', default: 0 })
  // @Field(() => Int)
  // parent_id!: number;
}
