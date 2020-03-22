import { Index, Entity, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { Base, Role } from '@leaa/common/src/entrys';

@Entity('permissions')
@Index('permissions_name_unique', ['name'], { unique: true })
@Index('permissions_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Permission extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field(() => String)
  slug!: string;

  @Field(() => String)
  slugGroup!: string;

  @ManyToMany(
    () => Role,
    role => role.permissions,
  )
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
