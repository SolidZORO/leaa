import { Index, Entity, Column, ManyToMany } from 'typeorm';

import { Base, Role } from '@leaa/api/src/entrys';

@Entity('permissions')
export class Permission extends Base {
  @Index('name')
  @Column({ type: 'varchar', length: 64, unique: true })
  name!: string;

  @Index('slug')
  @Column({ type: 'varchar', length: 64, unique: true })
  slug!: string;

  slugGroup!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];
}
