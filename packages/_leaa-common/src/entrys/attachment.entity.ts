import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('attachments')
@Index('attachments_uuid_unique', ['uuid'], { unique: true })
@ObjectType()
export class Attachment extends Base {
  @Column({ type: 'varchar', length: 48, unique: true })
  @Field(() => String)
  uuid!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  alt!: string;

  @Column({ type: 'varchar', length: 16 })
  @Field(() => String)
  type!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  filename!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  link?: string | null;

  @Column({ type: 'int' })
  @Field(() => Int)
  module_id!: number;

  @Column({ type: 'varchar', length: 64, comment: 'e.g. product' })
  @Field(() => String)
  module_name!: string;

  @Column({ type: 'varchar', length: 64, comment: 'e.g. gallery' })
  @Field(() => String)
  type_name!: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'e.g. mb/pc' })
  @Field(() => String, { nullable: true })
  type_platform?: string;

  @Column({ type: 'varchar', length: 8 })
  @Field(() => String)
  ext!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  width!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  height!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  size?: number;

  @Column({ type: 'varchar', length: 512 })
  @Field(() => String)
  path!: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'support multi-urls, e.g.: https://a.com/a.jpg|https://a.com/a_2x.jpg',
  })
  @Field(() => String)
  external_url?: string;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  urlAt2x?: string | null;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  at2x!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  in_local!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  in_oss!: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  user_id?: number | null;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  sort!: number;

  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  status!: number;
}
