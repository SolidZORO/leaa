import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

@Entity('divisions')
export class Division extends Base {
  @Index('code')
  @Column({ type: 'int', unique: true })
  code!: number;

  @Column({ type: 'int', default: null })
  province_code?: number;

  @Column({ type: 'int', default: null })
  city_code?: number;

  @Column({ type: 'varchar', default: null })
  name!: string;
}
