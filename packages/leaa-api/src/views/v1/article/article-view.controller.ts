import { Controller, Get, Render } from '@nestjs/common';
import { Crud, CrudController, ParsedRequest, CrudRequest, Override } from '@nestjsx/crud';
import { Article } from '@leaa/api/src/entrys';

import { ICrudRequest } from '@leaa/api/src/interfaces';
import { ArticleService } from '@leaa/api/src/modules/v1/article/article.service';

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
    allow: ['title', 'content'],
    join: {
      tags: { eager: true, allow: ['name'] },
      categories: { eager: true, allow: ['name'] },
    },
    limit: 3,
  },
})
@Controller('/aaa')
export class ArticleViewController implements CrudController<Article> {
  constructor(public service: ArticleService) {}

  @Get()
  @Render('article/index')
  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest): Promise<any> {
    return {
      list: await this.service.getMany(req),
    };
  }

  @Get(':id')
  @Render('article/show')
  @Override('getOneBase')
  async getOne(@ParsedRequest() req: ICrudRequest): Promise<any> {
    return {
      item: await this.service.getOne(req),
    };
  }
}
