import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';

import { Base, User, Permission } from '@leaa/api/src/entrys';

@Entity('roles')
export class Role extends Base {
  @Index('name')
  @Column({ type: 'varchar', length: 32, unique: true })
  name!: string;

  @Index('slug')
  @Column({ type: 'varchar', length: 32, unique: true })
  slug!: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions?: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  user?: User;
}
