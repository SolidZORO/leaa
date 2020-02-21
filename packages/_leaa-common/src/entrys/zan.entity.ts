import { Index, Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('zans')
@Index('zans_uuid_unique', ['uuid'], { unique: true })
@ObjectType()
export class Zan extends Base {
  @Column({ type: 'varchar', length: 48, unique: true })
  @Field(() => String)
  uuid!: string;

  @Column({ type: 'varchar', length: 256 })
  @Field(() => String)
  title!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  @Field(() => Int, { nullable: true })
  status?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  views?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  current_zan_quantity?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  target_zan_quantity?: number;

  //

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  creator?: User;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  @Field(() => [User], { nullable: true })
  users?: User[];
}
