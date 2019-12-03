import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('settings')
@Index('settings_name_unique', ['name'], { unique: true })
@Index('settings_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Setting extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  slug?: string;

  @Column({ type: 'varchar', length: 32 })
  @Field(() => String, { nullable: true })
  type!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  options?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  value?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  sort!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  private!: number;
}
