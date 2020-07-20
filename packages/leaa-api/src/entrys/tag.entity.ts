import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

@Entity('tags')
@Index('tags_name_unique', ['name'], { unique: true })
export class Tag extends Base {
  @Column({ type: 'varchar', length: 64, unique: true, default: null })
  name!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  icon?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  views?: number;
}
