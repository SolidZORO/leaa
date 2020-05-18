import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateTagInput, UpdateTagInput } from '@leaa/common/src/dtos/tag';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Tag } from '@leaa/common/src/entrys';
import { TagService } from './tag.service';

@Crud({
  model: { type: Tag },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: { maxLimit: 1000, alwaysPaginate: true },
  routes: {
    // getManyBase: { decorators: [Permissions('tag.list-read')] },
    // getOneBase: { decorators: [Permissions('tag.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateTagInput,
    update: UpdateTagInput,
  },
})
@Controller('/tags')
export class TagController implements CrudController<Tag> {
  constructor(public service: TagService) {}
}
