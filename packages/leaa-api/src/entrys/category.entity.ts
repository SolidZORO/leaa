import { Index, Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

@Entity('categories')
@Tree('nested-set')
export class Category extends Base {
  @Index('name')
  @Column({ type: 'varchar', length: 64, unique: true })
  name!: string | null;

  @Index('slug')
  @Column({ type: 'varchar', length: 64, unique: true })
  slug!: string;

  @Column({ type: 'varchar', nullable: true })
  parent_id!: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @TreeChildren()
  children?: Category[] | null;

  @TreeParent()
  parent?: Category | null;
}
