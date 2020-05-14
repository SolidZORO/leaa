import { SetMetadata } from '@nestjs/common';
import { IPermissionSlug } from '@leaa/common/src/interfaces';

export const PermissionsMetadataKey = 'permissions';

// TIPS: Permissions Decorator default condition is `AND`
//
// e.g. `@Permissions('p-delete', 'a-read')`, MUST BOTH HAS 'p-delete' && 'a-read'
//
export const Permissions = (...permissions: IPermissionSlug[]) => {
  return SetMetadata(PermissionsMetadataKey, permissions);
};
