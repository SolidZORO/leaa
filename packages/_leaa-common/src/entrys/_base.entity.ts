import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string;

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
