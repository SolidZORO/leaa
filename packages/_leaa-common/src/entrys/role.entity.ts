import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import { Base } from './_base.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('roles')
@Index('roles_name_unique', ['name'], { unique: true })
@Index('roles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Role extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  slug!: string;

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @ManyToMany(() => User, user => user.roles)
  @Field(() => User, { nullable: true })
  user?: User;
}
