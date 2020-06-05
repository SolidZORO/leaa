import { Index, Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { Base, Category, Tag } from '@leaa/api/src/entrys';

@Entity('articles')
@Index('articles_slug_unique', ['slug'], { unique: true })
export class Article extends Base {
  @Column({ type: 'varchar', length: 220 })
  title!: string;

  @Column({ type: 'varchar', length: 220, unique: true, default: null })
  slug?: string;

  @Column({ type: 'varchar', nullable: true })
  user_id?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'mediumtext', nullable: true })
  content?: string;

  @Column({ type: 'int', default: 0 })
  status?: number;

  @ManyToMany(() => Category)
  @JoinTable()
  categories?: Category[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags?: Tag[];

  @Column({ nullable: true })
  released_at?: Date;
}
