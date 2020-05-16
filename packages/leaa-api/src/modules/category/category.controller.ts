import { Controller, UseGuards, Get, Req, Query } from '@nestjs/common';
import { Crud, CrudController, ParsedRequest, CrudRequest } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
// import { curdConfig } from '@leaa/api/src/configs';
import { CreateCategoryInput, UpdateCategoryInput } from '@leaa/common/src/dtos/category';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Category } from '@leaa/common/src/entrys';
import { CategoryService } from './category.service';
import { QueryBuilder } from 'typeorm';

@Crud({
  model: {
    type: Category,
  },
  query: {
    maxLimit: 1000,
    alwaysPaginate: true,
  },
  routes: {
    getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard)] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('category.item-create')] },
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

  @Get('tree')
  // async tree(@ParsedRequest() req: CrudRequest) {
  async tree(@Req() req: CrudRequest, @Query() query: any) {
    return this.service.tree();
  }
}
