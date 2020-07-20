import { Index, Entity, Column } from 'typeorm';

import { Base, Attachment } from '@leaa/api/src/entrys';

@Entity('axs')
export class Ax extends Base {
  @Index('title')
  @Column({ type: 'varchar', length: 32, unique: true })
  title!: string;

  @Index('slug')
  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  // Virtual Field (not in DB)
  attachments?: Attachment[];
}
