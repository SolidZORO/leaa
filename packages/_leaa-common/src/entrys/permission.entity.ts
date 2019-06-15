import { Index, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { Role } from './role.entity';

@Entity('permissions')
@Index('permissions_name_unique', ['name'], { unique: true })
@Index('permissions_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  slug!: string;

  @ManyToMany(() => Role, role => role.permissions)
  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  //
  //

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at!: Date;

  @Column({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
