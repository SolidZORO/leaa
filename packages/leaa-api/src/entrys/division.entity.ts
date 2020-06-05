import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

@Entity('divisions')
@Index('divisions_code_unique', ['code'], { unique: true })
export class Division extends Base {
  @Column({ type: 'int' })
  code!: number;

  @Column({ type: 'int', default: null })
  province_code?: number;

  @Column({ type: 'int', default: null })
  city_code?: number;

  @Column({ type: 'varchar', default: null })
  name!: string;
}
