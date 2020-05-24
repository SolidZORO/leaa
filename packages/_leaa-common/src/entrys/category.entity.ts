import { Index, Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { Base } from '@leaa/common/src/entrys';

@Entity('categories')
@Index('categories_name_unique', ['name'], { unique: true })
@Index('categories_slug_unique', ['slug'], { unique: true })
@Tree('nested-set')
export class Category extends Base {
  @Column({ type: 'varchar', length: 64, unique: true })
  name!: string | null;

  // @Index()
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

  // Virtual Field (not in DB)
  // key?: string | null;
}
