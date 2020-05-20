import { Controller, UseGuards, Post, Get, Req, HttpCode, Body } from '@nestjs/common';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { Crud, CrudController } from '@nestjsx/crud';

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
    join: {
      roles: { eager: true },
    },
  },
  routes: {
    // getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.list-read')] },
    // getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('user.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateUserInput,
    update: UpdateUserInput,
  },
})
@Controller('/users')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @HttpCode(200)
  @Post('userByToken')
  async userByToken(@Req() req: ICrudRequest, @Body() body: any): Promise<any> {
    return this.service.userByToken(body);
  }

  @Get('userByHashid')
  async userByhashid(): Promise<any> {
    return this.service.userByHashid();
  }
}
