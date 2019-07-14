import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from './_base.entity';
import { Category } from './category.entity';

@Entity('articles')
@Index('articles_title_unique', ['title'], { unique: true })
@Index('articles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Article extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  title!: string;

  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  @Field(() => String, { nullable: true })
  slug?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  content?: string;

  @Column({ type: 'tinyint', default: -1 })
  @Field()
  status?: number;

  @Field(() => Category, { nullable: true })
  category?: Category;
}
