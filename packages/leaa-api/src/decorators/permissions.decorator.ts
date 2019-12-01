import { SetMetadata } from '@nestjs/common';
import { IPermissionSlug } from '@leaa/common/src/interfaces';

export const PermissionsMetadataKey = 'permissions';

export const Permissions = (...permissions: IPermissionSlug[]) => {
  return SetMetadata(PermissionsMetadataKey, permissions);
};
