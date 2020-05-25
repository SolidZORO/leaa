import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateArticleInput, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Article } from '@leaa/common/src/entrys';

import { ArticleService } from './article.service';

@Crud({
  model: { type: Article },
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
    join: {
      tags: { eager: true },
      categories: { eager: true },
    },
  },
  routes: {
    // getManyBase: { decorators: [Permissions('article.list-read')] },
    // getOneBase: { decorators: [Permissions('article.item-read')] },
    // createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('article.item-create')] },
    // updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('article.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('article.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateArticleInput,
    update: UpdateArticleInput,
  },
})
@Controller('/v1/articles')
export class ArticleController implements CrudController<Article> {
  constructor(public service: ArticleService) {}

  @Override('createOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('article.item-create')
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Article & CreateArticleInput): Promise<Article> {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('article.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateArticleInput): Promise<Article> {
    return this.service.updateOne(req, dto);
  }
}
