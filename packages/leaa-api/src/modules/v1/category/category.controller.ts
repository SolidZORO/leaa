import { Controller, UseGuards, Get, Req, Query } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest, ParsedBody } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CategoryCreateOneReq, CategoryUpdateOneReq } from '@leaa/api/src/dtos/category';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Category } from '@leaa/api/src/entrys';

import { CategoryService } from './category.service';

@Crud({
  model: { type: Category },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: { maxLimit: 1000, alwaysPaginate: true },
  routes: {
    exclude: ['createManyBase'],
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    // createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-create')] },
    // updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CategoryCreateOneReq,
    update: CategoryUpdateOneReq,
    replace: Category,
  },
})
@Controller('/v1/categories')
export class CategoryController implements CrudController<Category> {
  constructor(public service: CategoryService) {}

  @Override('createOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('category.item-create')
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category | CategoryCreateOneReq): Promise<Category> {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('category.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category | CategoryUpdateOneReq): Promise<Category> {
    return this.service.updateOne(req, dto);
  }

  //
  //

  @Get('tree')
  async tree(@Req() req: CrudRequest, @Query() query: ICategoriesQuery) {
    return this.service.tree(query);
  }
}
