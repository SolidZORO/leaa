import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Base {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  //

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  createdAt!: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  // SOFT DELETE
  // https://github.com/typeorm/typeorm/issues/534
  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
