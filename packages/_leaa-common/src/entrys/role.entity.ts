import { Index, Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
@Index('roles_name_unique', ['name'], { unique: true })
@Index('roles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  slug!: string;

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @ManyToMany(() => User, user => user.roles)
  @Field(() => User, { nullable: true })
  user?: User;

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
