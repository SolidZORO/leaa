import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { Base, User, Permission } from '@leaa/common/src/entrys';

@Entity('roles')
@Index('roles_name_unique', ['name'], { unique: true })
@Index('roles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Role extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field(() => String)
  slug!: string;

  @ManyToMany(
    () => Permission,
    permission => permission.roles,
  )
  @JoinTable()
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  @Field(() => User, { nullable: true })
  user?: User;
}
