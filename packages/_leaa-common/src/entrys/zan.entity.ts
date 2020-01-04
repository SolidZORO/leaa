import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('zans')
@Index('zans_uuid_unique', ['uuid'], { unique: true })
@ObjectType()
export class Zan extends Base {
  @Column({ type: 'varchar', length: 48, unique: true })
  @Field(() => String)
  uuid!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  title!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  status?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  views?: number;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User], { nullable: true })
  zan_users?: User[];
}
