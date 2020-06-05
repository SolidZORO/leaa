import { Index, Entity, Column, ManyToMany } from 'typeorm';

import { Base, Role } from '@leaa/api/src/entrys';

@Entity('permissions')
@Index('permissions_name_unique', ['name'], { unique: true })
@Index('permissions_slug_unique', ['slug'], { unique: true })
export class Permission extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  slug!: string;

  slugGroup!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];
}
