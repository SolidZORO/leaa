import { Index, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity('roles')
@Index('roles_name_unique', ['name'], { unique: true })
@Index('roles_slug_unique', ['slug'], { unique: true })
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 32 })
  @Field()
  slug!: string;

  //
  //

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // @CreateDateColumn()
  @Field(() => Date)
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  // @UpdateDateColumn()
  @Field(() => Date)
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date)
  deleted_at?: Date;
}
