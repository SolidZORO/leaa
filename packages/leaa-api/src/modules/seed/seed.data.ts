// prettier-ignore
import { decodeBase64 } from 'bcryptjs';

export const permissionsSeed = [
  { name: 'Permission List', slug: 'permission.list' },
  { name: 'Permission Item', slug: 'permission.item' },
  { name: 'Permission Create', slug: 'permission.create' },
  { name: 'Permission Update', slug: 'permission.update' },
  { name: 'Permission Delete', slug: 'permission.delete' },
  //
  { name: 'Role List', slug: 'role.list' },
  { name: 'Role Item', slug: 'role.item' },
  { name: 'Role Create', slug: 'role.create' },
  { name: 'Role Update', slug: 'role.update' },
  { name: 'Role Delete', slug: 'role.delete' },
  //
  { name: 'User List', slug: 'user.list' },
  { name: 'User Item', slug: 'user.item' },
  { name: 'User Create', slug: 'user.create' },
  { name: 'User Update', slug: 'user.update' },
  { name: 'User Delete', slug: 'user.delete' },
];

// prettier-ignore
export const rolesSeed = [
  { name: 'Admin', slug: 'admin' },
  { name: 'Staff', slug: 'staff' },
];

// prettier-ignore
export const usersSeed = [
  { email: 'admin@admin.com', name: 'admin', password: 'h8Hx9qvPKoHMLQgj', status: 1 },
  { email: 'staff@staff.com', name: 'staff', password: '7PkQGjvHMMkoo4RZ', status: 1 },
  { email: 'disabled@disabled.com', name: 'disabled', password: 'uUB3YGrdL3gJZYij', status: -1 },
];

const randomSersSeedData = [];

for (let i = 0; i < 100; i += 1) {
  const name = `RANDOM_USER_${i.toString().padStart(4, '0')}`;

  randomSersSeedData.push({
    email: `${name}@RRRR.com`,
    name,
    password: Math.random()
      .toString(36)
      .slice(-8),
    status: 1,
  });
}

export const randomSersSeed = randomSersSeedData;

// prettier-ignore
export const roleAddPermissionsSeed = [
  { roleSlug: 'admin', permissionSlugs: permissionsSeed.map(p => p.slug) }, // allpermissions
  { roleSlug: 'staff', permissionSlugs: permissionsSeed.filter(p => p.slug.includes('user.')).map(p => p.slug) },
];

// prettier-ignore
export const userAddRolesSeed = [
  { userEmail: 'admin@admin.com', roleSlugs: ['admin', 'staff'] },
  { userEmail: 'staff@staff.com', roleSlugs: ['staff'] },
];
