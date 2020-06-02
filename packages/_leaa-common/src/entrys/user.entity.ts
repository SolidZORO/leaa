import { Index, Entity, Column, JoinTable, ManyToMany, AfterLoad, BeforeInsert, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Base, Role, Permission, Address, Attachment } from '@leaa/common/src/entrys';
import { transAvatarUrl, genAvatarUrl } from '@leaa/api/src/utils/attachment.util';

@Entity('users')
@Unique('account', ['phone', 'email'])
@Index('account_unique', ['phone', 'email'])
export class User extends Base {
  @Column({ type: 'varchar', length: 64, nullable: true, default: '' })
  name?: string;

  @Column({ type: 'varchar', length: 16, default: null, unique: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 64, default: null, unique: true })
  email?: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  avatar_url?: string | null;

  @Column({ type: 'int', default: 0 })
  status?: number;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 64, select: false })
  password!: string;

  @Column({ type: 'int', default: 0 })
  is_admin?: number;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'int', default: 0, select: false })
  is_superuser?: number;

  @Exclude()
  @Column({ type: 'varchar', length: 32, nullable: true, select: false })
  last_login_ip?: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true, select: false })
  last_login_at?: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', nullable: true, select: false })
  last_token_at?: Date;

  // @Exclude({ toPlainOnly: true })
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

  //

  @AfterLoad()
  AfterLoad?() {
    this.avatar_url = transAvatarUrl(this.avatar_url);
  }

  @BeforeInsert()
  BeforeInsert?() {
    this.avatar_url = genAvatarUrl(this.email || this.phone || this.id || '');
  }
}
