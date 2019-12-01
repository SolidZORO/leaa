import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
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
import { formatUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';
import { ICategoryTreeWithKey } from '@leaa/api/src/interfaces';

type ICategoriessArgs = CategoriesArgs & FindOneOptions<Category>;
type ICategoryArgs = CategoryArgs & FindOneOptions<Category>;

const CONSTRUCTOR_NAME = 'CategoryService';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async categories(args: ICategoriessArgs): Promise<CategoriesWithPaginationObject> {
    const nextArgs: ICategoriessArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Category).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
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
      key: '0-0-0-root',
      title: '----',
      value: 0,
    });

    // TODO Is there any other better way for recurrence (GraphQL)?
    return {
      treeByStringify: JSON.stringify(tree),
    };
  }

  async category(id: number, args?: ICategoryArgs): Promise<Category | undefined> {
    let nextArgs: ICategoryArgs = {};
    if (args) nextArgs = args;

    return this.categoryRepository.findOne(id, nextArgs);
  }

  async createCategory(args: CreateCategoryInput): Promise<Category | undefined> {
    return this.categoryRepository.save({ ...args });
  }

  async updateCategory(id: number, args: UpdateCategoryInput): Promise<Category | undefined> {
    return curdUtil.commonUpdate(this.categoryRepository, CONSTRUCTOR_NAME, id, args);
  }

  async deleteCategory(id: number): Promise<Category | undefined> {
    // default category DONT
    if (id <= 2) {
      return errorUtil.ERROR({ error: 'default category PLEASE DONT' });
    }

    return curdUtil.commonDelete(this.categoryRepository, CONSTRUCTOR_NAME, id);
  }
}
