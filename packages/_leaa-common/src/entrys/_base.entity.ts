import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Base {
  // `id` possible be hidden
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id!: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field(() => String, { nullable: true })
  hashId!: string;

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
}
