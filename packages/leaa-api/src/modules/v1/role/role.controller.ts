import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest, ParsedBody } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateRoleInput, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Role } from '@leaa/common/src/entrys';

import { RoleService } from './role.service';

@Crud({
  model: { type: Role },
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
    join: {
      permissions: { eager: true },
    },
  },
  routes: {
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('role.list-read')] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('role.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('role.item-create')] },
    // updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('role.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('role.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateRoleInput,
    update: UpdateRoleInput,
    replace: Role,
  },
})
@Controller('/v1/roles')
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('role.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateRoleInput): Promise<Role> {
    return this.service.updateOne(req, dto);
  }
}
