import { Entity, Column, ManyToMany } from 'typeorm';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('addresses')
export class Address extends Base {
  @Column({ type: 'varchar', length: 255 })
  address?: string;

  @Column({ type: 'varchar', length: 128 })
  province?: string;

  @Column({ type: 'varchar', length: 128 })
  city?: string;

  @Column({ type: 'varchar', length: 128 })
  area?: string;

  @Column({ type: 'varchar', length: 64 })
  consignee?: string;

  @Column({ type: 'int', default: 0 })
  zip?: number;

  @Column({ type: 'varchar', length: 64 })
  phone?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  @ManyToMany(() => User, (user) => user.addresses)
  user?: User;
}
