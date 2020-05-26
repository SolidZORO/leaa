import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

import { Base, User } from '@leaa/common/src/entrys';

@Entity('zans')
export class Zan extends Base {
  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  status?: number;

  @Column({ type: 'int', default: 0 })
  views?: number;

  @Column({ type: 'int', default: 0 })
  current_zan_quantity?: number;

  @Column({ type: 'int', default: 0 })
  target_zan_quantity?: number;

  //

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator?: User;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  users?: User[];
}
