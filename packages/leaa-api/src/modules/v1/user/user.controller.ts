import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest, ParsedBody } from '@nestjsx/crud';

import { Permissions, JwtUser } from '@leaa/api/src/decorators';
import { UserCreateOneReq, UserUpdateOneReq } from '@leaa/api/src/dtos/user';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { User } from '@leaa/api/src/entrys';
import { UserService } from './user.service';

@Crud({
  model: { type: User },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
    password: {
      field: 'password',
      disabled: true,
    },
  },
  query: {
    maxLimit: 1000,
    alwaysPaginate: true,
    sort: [
      { field: 'created_at', order: 'DESC' },
      { field: 'email', order: 'DESC' },
    ],
    join: {
      roles: { eager: true },
    },
  },
  routes: {
    exclude: ['createManyBase'],
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.list-read')] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-read')] },
    // createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-create')] },
    // updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-update')] },
    deleteOneBase: {
      // decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: UserCreateOneReq,
    update: UserUpdateOneReq,
    replace: User,
  },
})
@Controller('/v1/users')
// @ts-ignore
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Override('createOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('user.item-create')
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User & UserCreateOneReq): Promise<User> {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('user.item-update')
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UserUpdateOneReq,
    @JwtUser() jwtUser: any,
  ): Promise<User> {
    return this.service.updateOne(req, dto, jwtUser);
  }

  @Override('deleteOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('user.item-delete')
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<User | void> {
    return this.service.deleteOne(req);
  }

  //
  //
}
