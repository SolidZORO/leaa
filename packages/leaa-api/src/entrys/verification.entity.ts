import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 256 })
  token!: string;

  @Column({ type: 'varchar', select: false })
  code?: string;

  // Virtual Field (not in DB)
  captcha?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
