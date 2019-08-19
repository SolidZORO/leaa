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
  public name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String, { nullable: true })
  public slug?: string;

  @Column({ type: 'varchar', length: 32 })
  @Field(() => String, { nullable: true })
  public type!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public description?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public options?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public value?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public sort!: number;
}
