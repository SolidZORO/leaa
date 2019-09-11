import { Base } from '@leaa/app/src/entrys';

export interface User extends Base {
  name?: string;
  phone?: string;
  email: string;
  status?: number;
  password: string;
  lastLogin_ip?: string;
  lastLogin_at?: Date;
  roles?: any[];
  permissions?: any[];
  flatePermissions?: string[];
  authToken?: string;
  authExpiresIn?: number;
}
