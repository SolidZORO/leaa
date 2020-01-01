import { Index, Entity, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

import { Base } from '@leaa/common/src/entrys';

@Entity('divisions')
@Index('divisions_code_unique', ['code'], { unique: true })
@ObjectType()
export class Division extends Base {
  @Column({ type: 'int' })
  @Field(() => Int)
  code!: number;

  @Column({ type: 'int', default: null })
  @Field(() => Int, { nullable: true })
  province_code?: number;

  @Column({ type: 'int', default: null })
  @Field(() => Int, { nullable: true })
  city_code?: number;

  @Column({ type: 'varchar', default: null })
  @Field(() => String)
  name!: string;
}
