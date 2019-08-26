import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

export enum OauthPlatform {
  wechat = 'wechat',
  weibo = 'weibo',
}

@Entity('oauths')
@Index('oauths_open_id_unique', ['open_id'], { unique: true })
@ObjectType()
export class Oauth extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  public open_id!: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  public union_id?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public app_id!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public user_id?: number;

  @Column({ type: 'enum', enum: OauthPlatform })
  @Field(() => String)
  public platform!: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  public ticket?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public ticket_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  public access_token?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  public refresh_token?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public nickname!: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  public sex!: number;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public city!: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public province!: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public country!: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  public avatar_url!: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  public last_oauth_at?: Date;
}
