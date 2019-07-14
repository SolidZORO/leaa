import { Index, Entity, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

import { Base } from './_base.entity';
import { Role } from './role.entity';

@Entity('permissions')
@Index('permissions_name_unique', ['name'], { unique: true })
@Index('permissions_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Permission extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  slug!: string;

  @Field()
  slugGroup!: string;

  @ManyToMany(() => Role, role => role.permissions)
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
