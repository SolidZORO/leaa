import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base, Role, Permission } from '@leaa/common/entrys';

@Entity('users')
// @Index('users_phone_unique', ['phone'], { unique: true })
@Index('users_email_unique', ['email'], { unique: true })
@ObjectType()
export class User extends Base {
  @Column({ type: 'varchar', length: 64, nullable: true, default: '' })
  @Field({ nullable: true })
  public name?: string;

  // @Column({ type: 'varchar', length: 32, unique: true })
  @Column({ type: 'varchar', length: 32, default: '', nullable: true })
  @Field(() => String, { nullable: true })
  public phone?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  public email!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  public status?: number;

  @Column({ type: 'varchar', length: 64, select: false })
  // @Field()
  public password!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field(() => String, { nullable: true })
  public lastLogin_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  public lastLogin_at?: Date;

  @ManyToMany(() => Role, role => role.user)
  @JoinTable()
  @Field(() => [Role], { nullable: true })
  public roles?: Role[];

  // Virtual Field (not in DB)
  @Field(() => [Permission], { nullable: true })
  public permissions?: Permission[];

  @Field(() => [String], { nullable: true })
  public flatePermissions?: string[];

  @Field(() => String, { nullable: true })
  public authToken?: string;

  @Field(() => Int, { nullable: true })
  public authExpiresIn?: number;
}
