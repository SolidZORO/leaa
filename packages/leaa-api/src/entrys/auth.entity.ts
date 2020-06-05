import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

export enum AuthPlatform {
  wechat = 'wechat',
  miniprogram = 'miniprogram',
  weibo = 'weibo',
  github = 'github',
}

@Entity('auths')
@Index('auths_open_id_unique', ['open_id'], { unique: true })
export class Auth extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  open_id!: string;

  @Column({ type: 'varchar', nullable: true })
  union_id?: string;

  @Column({ type: 'varchar', length: 64 })
  app_id!: string;

  @Column({ type: 'varchar', nullable: true })
  user_id?: string;

  @Column({ type: 'enum', enum: AuthPlatform })
  platform!: string;

  @Column({ type: 'varchar', nullable: true })
  ticket?: string | null;

  @Column({ nullable: true })
  ticket_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  access_token?: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token?: string;

  @Column({ type: 'varchar', length: 64 })
  nickname!: string;

  @Column({ type: 'int' })
  sex!: number;

  @Column({ type: 'varchar', length: 64 })
  city!: string;

  @Column({ type: 'varchar', length: 64 })
  province!: string;

  @Column({ type: 'varchar', length: 64 })
  country!: string;

  @Column({ type: 'varchar' })
  avatar_url!: string;

  @Column({ nullable: true })
  last_auth_at?: Date;
}
