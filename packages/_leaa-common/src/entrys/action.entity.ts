import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IModuleNameEnum } from '@leaa/common/src/interfaces';

@Entity('actions')
@ObjectType()
export class Action {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  @Field(() => String, { nullable: true })
  ip!: string;

  @Index()
  @Column({ type: 'enum', enum: IModuleNameEnum })
  @Field(() => String)
  module!: string;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  action!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  @Field(() => String, { nullable: true })
  account?: string;

  @Column({ type: 'varchar', nullable: true, comment: 'ONLY log guestToken' })
  @Field(() => String, { nullable: true })
  token?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  @Field(() => String, { nullable: true })
  user_id?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  diff?: string;

  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at!: Date;
}
