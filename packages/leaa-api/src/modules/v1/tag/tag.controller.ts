import { Controller, UseGuards, Post } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { Permissions } from '@leaa/api/src/decorators';
import { TagCreateOneReq, TagUpdateOneReq } from '@leaa/api/src/dtos/tag';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Tag } from '@leaa/api/src/entrys';

import { TagService } from './tag.service';

// import { Crud, CrudController, Override, ParsedRequest, CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

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
    exclude: ['replaceOneBase', 'createManyBase'],
    // getManyBase: { decorators: [Permissions('tag.list-read')] },
    // getOneBase: { decorators: [Permissions('tag.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard)] },
    // createManyBase: { decorators: [UseGuards(JwtGuard)] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-update')] },
    replaceOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('tag.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: TagCreateOneReq,
    update: TagUpdateOneReq,
    replace: Tag,
  },
})
@Controller('/v1/tags')
export class TagController implements CrudController<Tag> {
  constructor(public service: TagService) {}

  @Override('getManyBase')
  getMany(@ParsedRequest() req: ICrudRequest): Promise<GetManyDefaultResponse<Tag> | Tag[]> {
    // console.log('Tag Controller Dump Req >>>', req);

    return this.service.getMany(req);
  }

  @Override('createOneBase')
  @UseGuards(JwtGuard)
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Tag & TagCreateOneReq): Promise<Tag> {
    return this.service.createOne(req, dto);
  }

  @Post('sync-tags-to-dict-file')
  @UseGuards(JwtGuard)
  async userByToken(): Promise<any> {
    return this.service.syncTagsToDictFile();
  }
}
