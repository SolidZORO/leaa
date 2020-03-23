import { Entity, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('addresses')
@ObjectType()
export class Address extends Base {
  @Column({ type: 'varchar', length: 255 })
  @Field(() => String, { nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 128 })
  @Field(() => String, { nullable: true })
  province?: string;

  @Column({ type: 'varchar', length: 128 })
  @Field(() => String, { nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 128 })
  @Field(() => String, { nullable: true })
  area?: string;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String, { nullable: true })
  consignee?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  zip?: number;

  @Column({ type: 'varchar', length: 64 })
  @Field(() => String, { nullable: true })
  phone?: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: true })
  status?: number;

  @ManyToMany(() => User, (user) => user.addresses)
  @Field(() => User, { nullable: true })
  user?: User;
}
