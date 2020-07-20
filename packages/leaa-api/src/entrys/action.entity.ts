import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

import { IModuleNameEnum } from '@leaa/api/src/interfaces';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  ip!: string;

  @Index('module')
  @Column({ type: 'enum', enum: IModuleNameEnum })
  module!: string;

  @Index('action')
  @Column({ type: 'varchar', length: 64 })
  action!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  account?: string;

  @Column({ type: 'varchar', nullable: true, comment: 'ONLY log guestToken' })
  token?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  user_id?: string;

  @Column({ type: 'text', nullable: true })
  diff?: string;

  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
