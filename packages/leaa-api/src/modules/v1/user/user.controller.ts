import { Controller, UseGuards, Post, Get, Req, HttpCode, Body } from '@nestjs/common';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest, ParsedBody } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateUserInput, UpdateUserInput } from '@leaa/common/src/dtos/user';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { User } from '@leaa/common/src/entrys';
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
    sort: [{ field: 'created_at', order: 'DESC' }],
    join: {
      roles: { eager: true },
    },
  },
  routes: {
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
    create: CreateUserInput,
    update: UpdateUserInput,
    replace: User,
  },
})
@Controller('/v1/users')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Override('createOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('user.item-create')
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User & CreateUserInput): Promise<User> {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('user.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateUserInput): Promise<User> {
    return this.service.updateOne(req, dto);
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
