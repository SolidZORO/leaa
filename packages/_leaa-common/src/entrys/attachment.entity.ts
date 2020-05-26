import { Entity, Column } from 'typeorm';
import { Expose } from 'class-transformer';

import { Base } from '@leaa/common/src/entrys';
import { buildUrl, buildUrlAt2x } from '@leaa/api/src/utils/attachment.util';

@Entity('attachments')
export class Attachment extends Base {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  alt!: string;

  @Column({ type: 'varchar', length: 16 })
  type!: string;

  @Column({ type: 'varchar', length: 255 })
  filename!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link?: string | null;

  @Column({ type: 'varchar' })
  module_id!: string;

  @Column({ type: 'varchar', length: 64, comment: 'e.g. product' })
  module_name!: string;

  @Column({ type: 'varchar', length: 64, comment: 'e.g. gallery' })
  type_name!: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'e.g. mb/pc' })
  type_platform?: string;

  @Column({ type: 'varchar', length: 8 })
  ext!: string;

  @Column({ type: 'int', default: 0 })
  width!: number;

  @Column({ type: 'int', default: 0 })
  height!: number;

  @Column({ type: 'int', default: 0 })
  size?: number;

  @Column({ type: 'varchar', length: 512 })
  path!: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'support multi-urls, e.g.: https://a.com/a.jpg|https://a.com/a_2x.jpg',
  })
  external_url?: string;

  @Column({ type: 'int', default: 0 })
  at2x!: number;

  @Column({ type: 'int', default: 0 })
  in_local!: number;

  @Column({ type: 'int', default: 0 })
  in_oss!: number;

  @Column({ type: 'varchar', nullable: true })
  user_id?: string | null;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'int', default: 1 })
  status!: number;

  //
  //

  @Expose()
  get url(): null | undefined | string {
    return buildUrl(this);
  }

  @Expose()
  get urlAt2x(): null | undefined | string {
    return buildUrlAt2x(this);
  }
}
