import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, Category } from '@leaa/common/entrys';

@Entity('articles')
@Index('articles_title_unique', ['title'], { unique: true })
@Index('articles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Article extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  public title!: string;

  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  @Field(() => String, { nullable: true })
  public slug?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  public category_id?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  public user_id?: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public description?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public content?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  public status?: number;

  @Field(() => Category, { nullable: true })
  public category?: Category;
}
