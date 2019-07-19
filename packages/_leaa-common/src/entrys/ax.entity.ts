import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from './_base.entity';

@Entity('axs')
@Index('axs_title_unique', ['title'], { unique: true })
@Index('axs_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Ax extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  title!: string;

  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  @Field(() => String, { nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'tinyint', default: 0 })
  @Field(() => Int, { nullable: true })
  status?: number;
}
