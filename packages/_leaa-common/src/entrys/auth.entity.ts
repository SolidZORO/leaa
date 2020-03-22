import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Base } from '@leaa/common/src/entrys';

export enum AuthPlatform {
  wechat = 'wechat',
  miniprogram = 'miniprogram',
  weibo = 'weibo',
  github = 'github',
}

@Entity('auths')
@Index('auths_open_id_unique', ['open_id'], { unique: true })
@ObjectType()
export class Auth extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  open_id!: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  union_id?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  app_id!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  user_id?: number;

  @Column({ type: 'enum', enum: AuthPlatform })
  @Field(() => String)
  platform!: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  ticket?: string | null;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  ticket_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  access_token?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  refresh_token?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  nickname!: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  sex!: number;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  city!: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  province!: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  country!: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  avatar_url!: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  last_auth_at?: Date;
}
