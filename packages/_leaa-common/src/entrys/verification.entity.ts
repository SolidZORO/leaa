import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

// export enum AuthType {
//   phone = 'phone',
//   email = 'email',
// }

@Entity('verifications')
@ObjectType()
export class Verification {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  // @Column({ type: 'enum', enum: AuthType })
  // @Field(() => String)
  // type!: string;

  @Column({ type: 'varchar', length: 256 })
  @Field(() => String)
  token!: string;

  @Column({ type: 'varchar', select: false })
  @Field(() => String)
  code?: string;

  // Virtual Field (not in DB)
  @Field(() => String, { nullable: true })
  captcha?: string;

  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { nullable: true })
  updated_at?: Date;
}
