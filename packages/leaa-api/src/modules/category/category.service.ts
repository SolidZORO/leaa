import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '@leaa/common/src/entrys';
import {
  CategoriesArgs,
  CategoriesWithPaginationObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoriesWithTreeObject,
} from '@leaa/common/src/dtos/category';
import { BaseService } from '@leaa/api/src/modules/base/base.service';
import { formatUtil, loggerUtil } from '@leaa/api/src/utils';
import { ICategoryTreeWithKey } from '@leaa/api/src/interfaces';

const CONSTRUCTOR_NAME = 'CategoryService';

@Injectable()
export class CategoryService extends BaseService<
  Category,
  CategoriesArgs,
  CategoriesWithPaginationObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput
> {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
    super(categoryRepository);
  }

  async categories(args?: CategoriesArgs): Promise<CategoriesWithPaginationObject> {
    if (!args) {
      const message = `get categories args does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

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

  async categoriesByTree(): Promise<CategoriesWithTreeObject | undefined> {
    const [items] = await this.categoryRepository.findAndCount();

    const itemsWithKey: ICategoryTreeWithKey[] = items.map((item: Category, i) => ({
      id: item.id,
      parent_id: item.parent_id,
      key: `${item.parent_id}-${item.id}-${i}-${item.slug}`,
      title: item.name,
      value: item.id,
    }));

    const buildTree = (data: ICategoryTreeWithKey[]) => {
      const root: { [key: number]: ICategoryTreeWithKey } = {};
      const result: ICategoryTreeWithKey[] = [];

      data.forEach(item => {
        root[item.id] = item;
      });

      data.forEach(item => {
        // parent_id === 0 ----> undefined
        const parent: ICategoryTreeWithKey = root[item.parent_id];

        if (parent) {
          if (!Array.isArray(parent.children)) {
            parent.children = [];
          }

          parent.children.push(item);
        } else {
          result.push(item);
        }
      });

      return result;
    };

    const tree = buildTree(itemsWithKey);

    tree.unshift({
      id: 0,
      parent_id: 0,
      key: `0-0-0-root`,
      title: '----',
      value: 0,
    });

    // TODO Is there any other better way for recurrence?
    return {
      treeByStringify: JSON.stringify(tree),
    };
  }

  async category(id: number, args?: CategoryArgs & FindOneOptions<Category>): Promise<Category | undefined> {
    let nextArgs: FindOneOptions<Category> = {};

    if (args) {
      nextArgs = args;
    }

    return this.findOne(id, nextArgs);
  }

  async createCategory(args: CreateCategoryInput): Promise<Category | undefined> {
    return this.categoryRepository.save({ ...args });
  }

  async updateCategory(id: number, args: UpdateCategoryInput): Promise<Category | undefined> {
    return this.update(id, args);
  }

  async deleteCategory(id: number): Promise<Category | undefined> {
    return this.delete(id);
  }
}
