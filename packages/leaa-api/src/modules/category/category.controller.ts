import { Controller, UseGuards, Get, Req, Query } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest, ParsedBody } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateCategoryInput, UpdateCategoryInput } from '@leaa/common/src/dtos/category';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Category } from '@leaa/common/src/entrys';
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
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateCategoryInput,
    update: UpdateCategoryInput,
  },
})
@Controller('/categories')
export class CategoryController implements CrudController<Category> {
  constructor(public service: CategoryService) {}

  @Override('createOneBase')
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category & CreateCategoryInput): Promise<Category> {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category & UpdateCategoryInput): Promise<Category> {
    return this.service.updateOne(req, dto);
  }

  //
  //

  @Get('tree')
  async tree(@Req() req: CrudRequest, @Query() query: ICategoriesQuery) {
    return this.service.tree(query);
  }
}
