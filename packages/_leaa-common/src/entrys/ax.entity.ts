import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { AxAttachmentsObject } from '@leaa/common/dtos/ax';

import { Base } from './_base.entity';

@Entity('axs')
@Index('axs_title_unique', ['title'], { unique: true })
@Index('axs_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Ax extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  public title!: string;

  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  @Field(() => String, { nullable: true })
  public slug?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public description?: string;

  @Column({ type: 'tinyint', default: 0 })
  @Field(() => Int, { nullable: true })
  public status?: number;

  // Virtual Field (not in DB)
  @Field(() => AxAttachmentsObject, { nullable: true })
  public attachments?: AxAttachmentsObject;
}
