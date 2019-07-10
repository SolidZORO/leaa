import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '@leaa/common/entrys';
import {
  CategoriesArgs,
  CategoriesObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@leaa/common/dtos/category';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil } from '@leaa/api/utils';

const CONSTRUCTOR_NAME = 'CategoryService';

@Injectable()
export class CategoryService extends BaseService<
  Category,
  CategoriesArgs,
  CategoriesObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput
> {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
    super(categoryRepository);
  }

  async categories(args: CategoriesArgs): Promise<CategoriesObject> {
    const nextArgs = formatUtil.formatArgs(args);

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ slug: qLike }, { name: qLike }];
    }

    const [items, total] = await this.categoryRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async category(id: number, args?: CategoryArgs & FindOneOptions<Category>): Promise<Category | undefined> {
    let nextArgs: FindOneOptions<Category> = {};

    if (args) {
      nextArgs = args;
    }

    return this.findOne(id, nextArgs);
  }

  async craeteCategory(args: CreateCategoryInput): Promise<Category | undefined> {
    return this.categoryRepository.save({ ...args });
  }

  async updateCategory(id: number, args: UpdateCategoryInput): Promise<Category | undefined> {
    return this.update(id, args);
  }

  async deleteCategory(id: number): Promise<Category | undefined> {
    return this.delete(id);
  }
}
