import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Base } from '@leaa/common/entrys/_base.entity';

@Entity('categories')
@Index('categories_name_unique', ['name'], { unique: true })
@Index('categories_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Category extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field()
  slug!: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  parentId!: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;
}
