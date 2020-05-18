import { Index, Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Base, Role, Permission, Address, Attachment } from '@leaa/common/src/entrys';

@Entity('users')
// @Index('users_phone_unique', ['phone'], { unique: true })
@Index('users_email_unique', ['email'], { unique: true })
export class User extends Base {
  @Column({ type: 'varchar', length: 64, nullable: true, default: '' })
  name?: string;

  @Expose()
  get fullName(): string {
    return `${this.name} ------------ `;
  }

  // @Column({ type: 'varchar', length: 32, unique: true })
  @Column({ type: 'varchar', length: 32, default: '', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  avatar_url?: string | null;

  @Column({ type: 'int', default: 0 })
  status?: number;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 64, select: false })
  password!: string;

  @Column({ type: 'int', default: 0 })
  is_admin?: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  last_login_ip?: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_token_at?: Date;

  @ManyToMany(() => Role, (role) => role.user)
  @JoinTable()
  roles?: Role[];

  @ManyToMany(() => Address, (address) => address.address)
  @JoinTable()
  addresses?: Address[];

  // Virtual Field (not in DB)
  permissions?: Permission[];

  flatPermissions?: string[];

  authToken?: string;

  authExpiresIn?: number;

  avatar?: Attachment;
}
