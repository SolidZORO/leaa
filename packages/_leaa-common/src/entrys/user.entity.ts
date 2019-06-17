import { Index, Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('users')
// @Index('users_phone_unique', ['phone'], { unique: true })
@Index('users_email_unique', ['email'], { unique: true })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 64, nullable: true, default: '' })
  @Field({ nullable: true })
  name?: string;

  // @Column({ type: 'varchar', length: 32, unique: true })
  @Column({ type: 'varchar', length: 32, default: '18688880000' })
  @Field()
  phone!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field()
  email!: string;

  @Column({ type: 'tinyint', default: -1 })
  @Field()
  status?: number;

  @Column({ type: 'varchar', length: 64, select: false })
  // @Field()
  password!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field()
  last_login_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date)
  last_login_at?: Date;

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

  //
  //

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at!: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
