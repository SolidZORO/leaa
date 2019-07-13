import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Base } from '@leaa/common/entrys/_base.entity';

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
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  link?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  moduleName!: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  moduleId!: number;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  moduleType!: string;

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

  @Column({ type: 'tinyint', default: 0 })
  @Field(() => Int)
  at2x!: number;

  @Column({ type: 'tinyint', default: 0 })
  @Field(() => Int)
  inLocal!: number;

  @Column({ type: 'tinyint', default: 0 })
  @Field(() => Int)
  inCloud!: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  sort!: number;

  @Column({ type: 'tinyint', default: 1 })
  @Field(() => Int)
  status!: number;
}
