import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  // SOFT DELETE
  // https://github.com/typeorm/typeorm/issues/534
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', nullable: true, select: false })
  deleted_at?: Date;
}
