import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import { Base } from './_base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

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
  @Field()
  phone?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field()
  email!: string;

  @Column({ type: 'tinyint', default: 0 })
  @Field()
  status?: number;

  @Column({ type: 'varchar', length: 64, select: false })
  // @Field()
  password!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field()
  lastLoginIp?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date)
  lastLoginAt?: Date;

  @ManyToMany(() => Role, role => role.user)
  @JoinTable()
  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  // Virtual Field (not in DB)
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @Field(() => [String], { nullable: true })
  flatePermissions?: string[];

  @Field({ nullable: true })
  authToken?: string;

  @Field({ nullable: true })
  authExpiresIn?: number;
}
