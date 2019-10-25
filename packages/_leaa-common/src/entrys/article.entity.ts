import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, Category, Tag } from '@leaa/common/src/entrys';

@Entity('articles')
@Index('articles_title_unique', ['title'], { unique: true })
@Index('articles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Article extends Base {
  @Column({ type: 'varchar', length: 128, unique: true })
  @Field()
  public title!: string;

  @Column({ type: 'varchar', length: 128, unique: true, default: null })
  @Field(() => String, { nullable: true })
  public slug?: string;

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

  @ManyToMany(() => Category)
  @JoinTable()
  @Field(() => [Category], { nullable: true })
  categories?: Category[];

  @ManyToMany(() => Tag)
  @JoinTable()
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
