import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, Role, Permission, Address, Attachment } from '@leaa/common/src/entrys';

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

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  avatar_url?: string | null;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  status?: number;

  @Column({ type: 'varchar', length: 64, select: false })
  password!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  is_admin?: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field(() => String, { nullable: true })
  last_login_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  last_login_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  last_token_at?: Date;

  @ManyToMany(
    () => Role,
    role => role.user,
  )
  @JoinTable()
  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  @ManyToMany(
    () => Address,
    address => address.address,
  )
  @JoinTable()
  @Field(() => [Address], { nullable: true })
  addresses?: Address[];

  // Virtual Field (not in DB)
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @Field(() => [String], { nullable: true })
  flatPermissions?: string[];

  @Field(() => String, { nullable: true })
  authToken?: string;

  @Field(() => Int, { nullable: true })
  authExpiresIn?: number;

  @Field(() => Attachment, { nullable: true })
  avatar?: Attachment;
}
