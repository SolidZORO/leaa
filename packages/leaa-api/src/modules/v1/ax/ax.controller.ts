import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Ax } from '@leaa/common/src/entrys';

import { AxService } from './ax.service';

@Crud({
  model: { type: Ax },
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
    sort: [{ field: 'created_at', order: 'DESC' }],
  },
  routes: {
    exclude: ['createManyBase'],
    // getManyBase: { decorators: [Permissions('ax.list-read')] },
    // getOneBase: { decorators: [Permissions('ax.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('ax.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('ax.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('ax.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateAxInput,
    update: UpdateAxInput,
    replace: Ax,
  },
})
@Controller('/v1/axs')
export class AxController implements CrudController<Ax> {
  constructor(public service: AxService) {}

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('ax.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateAxInput): Promise<Ax> {
    return this.service.updateOne(req, dto);
  }
}
