import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

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
    join: {
      tags: { eager: true },
      categories: { eager: true },
    },
  },
  routes: {
    // getManyBase: { decorators: [Permissions('article.list-read')] },
    // getOneBase: { decorators: [Permissions('article.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('article.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('article.item-update')] },
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
@Controller('/articles')
export class ArticleController implements CrudController<Article> {
  constructor(public service: ArticleService) {}
}
