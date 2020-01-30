import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Exclude } from 'class-transformer';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('zans')
@ObjectType()
// export class Zan extends Base {
export class Zan {
  // `id` possible be hidden
  @Exclude()
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id!: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  @Field(() => String, { nullable: true })
  hashId?: string;

  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  // SOFT DELETE
  // https://github.com/typeorm/typeorm/issues/534
  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

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
  @Exclude()
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
