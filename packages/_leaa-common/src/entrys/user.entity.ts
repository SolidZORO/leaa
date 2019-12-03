import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, Role, Permission } from '@leaa/common/src/entrys';

@Entity('users')
// @Index('users_phone_unique', ['phone'], { unique: true })
@Index('users_email_unique', ['email'], { unique: true })
@ObjectType()
export class User extends Base {
  @Column({ type: 'varchar', length: 64, nullable: true, default: '' })
  @Field({ nullable: true })
  name?: string;

  // @Column({ type: 'varchar', length: 32, unique: true })
  @Column({ type: 'varchar', length: 32, default: '', nullable: true })
  @Field(() => String, { nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  email!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  status?: number;

  @Column({ type: 'varchar', length: 64, select: false })
  // @Field()
  password!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field(() => String, { nullable: true })
  lastLogin_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  lastLogin_at?: Date;

  @ManyToMany(() => Role, role => role.user)
  @JoinTable()
  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  // Virtual Field (not in DB)
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @Field(() => [String], { nullable: true })
  flatPermissions?: string[];

  @Field(() => String, { nullable: true })
  authToken?: string;

  @Field(() => Int, { nullable: true })
  authExpiresIn?: number;
}
