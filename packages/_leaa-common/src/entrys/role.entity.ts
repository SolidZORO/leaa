import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';

import { Base, User, Permission } from '@leaa/common/src/entrys';

@Entity('roles')
@Index('roles_name_unique', ['name'], { unique: true })
@Index('roles_slug_unique', ['slug'], { unique: true })
export class Role extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  slug!: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions?: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  user?: User;
}
