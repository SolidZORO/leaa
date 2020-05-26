import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { Base, Attachment } from '@leaa/common/src/entrys';

@Entity('axs')
@Index('axs_title_unique', ['title'], { unique: true })
@Index('axs_slug_unique', ['slug'], { unique: true })
export class Ax extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  title!: string;

  @Column({ type: 'varchar', length: 32, unique: true, default: null })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  // Virtual Field (not in DB)
  // attachments?: AxAttachmentsObject;

  @ManyToMany(() => Attachment)
  @JoinTable()
  attachments?: Attachment[];
}
