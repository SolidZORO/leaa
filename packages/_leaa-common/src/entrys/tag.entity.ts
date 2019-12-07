import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('tags')
@Index('tags_name_unique', ['name'], { unique: true })
@ObjectType()
export class Tag extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  name!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  @Field(() => String, { nullable: true })
  icon?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  count?: number;
}
