import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { PermissionCreateOneReq, PermissionUpdateOneReq } from '@leaa/api/src/dtos/permission';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Permission } from '@leaa/api/src/entrys';

import { PermissionService } from './permission.service';

@Crud({
  model: { type: Permission },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 1000,
    alwaysPaginate: true,
    sort: [
      { field: 'created_at', order: 'DESC' },
      { field: 'slug', order: 'ASC' },
    ],
  },
  routes: {
    exclude: ['createManyBase'],
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('permission.list-read')] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('permission.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('permission.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('permission.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('permission.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: PermissionCreateOneReq,
    update: PermissionUpdateOneReq,
    replace: Permission,
  },
})
@Controller('/v1/permissions')
export class PermissionController implements CrudController<Permission> {
  constructor(public service: PermissionService) {}
}
