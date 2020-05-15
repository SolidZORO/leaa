import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
// import { curdConfig } from '@leaa/api/src/configs';
import { CreateArticleInput, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Article } from '@leaa/common/src/entrys';
import { ArticleService } from './article.service';

@Crud({
  model: {
    type: Article,
  },
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
    createOneBase: { decorators: [Permissions('article.item-create')] },
    deleteOneBase: { decorators: [Permissions('article.item-delete')], returnDeleted: true },
  },
  dto: {
    create: CreateArticleInput,
    update: UpdateArticleInput,
  },
})
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('/articles')
export class ArticleController implements CrudController<Article> {
  constructor(public service: ArticleService) {}
}
