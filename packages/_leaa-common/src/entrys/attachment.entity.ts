import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Base } from './_base.entity';

@Entity('attachments')
@Index('attachments_uuid_unique', ['uuid'], { unique: true })
@ObjectType()
export class Attachment extends Base {
  @Column({ type: 'varchar', length: 48, unique: true })
  @Field(() => String)
  public uuid!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  public title!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  public alt!: string;

  @Column({ type: 'varchar', length: 16 })
  @Field(() => String)
  public type!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  public filename!: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  public description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  public link?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public moduleName!: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  public moduleId!: number;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String)
  public moduleType!: string;

  @Column({ type: 'varchar', length: 8 })
  @Field(() => String)
  public ext!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public width!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public height!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public size?: number;

  @Column({ type: 'varchar', length: 512 })
  @Field(() => String)
  public path!: string;

  @Field(() => String, { nullable: true })
  public pathAt2x?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public at2x!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public inLocal!: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public inCloud!: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  public categoryId?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  public userId?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public sort!: number;

  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  public status!: number;
}
