import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('tags')
@Index('tags_name_unique', ['name'], { unique: true })
@ObjectType()
export class Tag extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  public name!: string;

  @Column({ type: 'varchar', length: 256 })
  @Field(() => String, { nullable: true })
  public icon?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public description?: string;
}
