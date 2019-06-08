import { Index, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity('users')
@Index('users_phone_unique', ['phone'], { unique: true })
@Index('users_email_unique', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 64, unique: true, nullable: true })
  @Field({ nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Field({ nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Field()
  email!: string;

  @Column({ type: 'tinyint' })
  @Field()
  status!: number;

  @Column({ type: 'varchar', length: 64 })
  @Field()
  password!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  @Field()
  last_login_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date)
  last_login_at?: Date;

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
