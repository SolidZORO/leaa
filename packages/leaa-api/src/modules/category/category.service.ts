import _ from 'lodash';
import moment from 'moment';
import { TreeRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { Category } from '@leaa/common/src/entrys';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { CategoryTreeObject, CreateCategoryInput, UpdateCategoryInput } from '@leaa/common/src/dtos/category';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) private readonly categoryRepo: TreeRepository<Category>) {
    super(categoryRepo);
  }

  async createOne(req: CrudRequest, dto: Category & CreateCategoryInput): Promise<Category> {
    const nextDto = {
      ...dto,
      parent: await this.formatParentId(dto.parent_id),
    };

    return super.createOne(req, nextDto);
  }

  async updateOne(req: CrudRequest, dto: Category & UpdateCategoryInput): Promise<Category> {
    const nextDto = {
      ...dto,
      parent: await this.formatParentId(dto.parent_id),
    };

    return super.updateOne(req, nextDto);
  }

  //
  //

  async formatParentId(parentId?: string | null) {
    if (parentId === '----' || null) return null;
    if (parentId) return this.categoryRepo.findOneOrFail(parentId);

    return null;
  }

  async tree(options?: ICategoriesQuery) {
    const categories = await (this.categoryRepo as TreeRepository<Category>).findTrees();

    return this.categoriesByTrees(categories, options);
  }

  rootCategory(children?: any[]) {
    return {
      // key: '0-0-0-root',
      id: '----',
      parent_id: null,
      slug: '----',
      name: '----',
      //
      title: '----',
      subtitle: 'root',
      value: '',
      expanded: true,
      created_at: moment.unix(1318000000).toDate(),
      children,
    };
  }

  categoriesByTrees(items: Category[], options?: ICategoriesQuery): CategoryTreeObject[] {
    const appendInfoToItem = (item: Category): Omit<CategoryTreeObject, 'children'> => ({
      ...item,
      // key: `${item.parent_id}-${item.id}-${item.slug}`,
      //
      title: `${item.name}`,
      subtitle: item.slug,
      value: item.id,
      expanded: Boolean([true, 'true'].includes(options?.expanded || '')),
    });

    const recursiveItems = (categories: Category[]): CategoryTreeObject[] => {
      return categories.map((category) => {
        if (category.children && Array.isArray(category.children) && category.children.length > 0) {
          // eslint-disable-next-line no-param-reassign
          category.children = recursiveItems(category.children);
        }

        return appendInfoToItem(category);
      });
    };

    const result = recursiveItems(items);

    // pick parent slug OR id
    if (result && _.isArray(result) && (options?.parentSlug || options?.parentId)) {
      let pickPatent: CategoryTreeObject | undefined;

      if (options?.parentSlug) pickPatent = result.find((c) => c.slug === options.parentSlug);
      if (options?.parentId) pickPatent = result.find((c) => c.id === options.parentId);

      return [this.rootCategory(pickPatent?.children)];
    }

    return [this.rootCategory(result)];
  }

  async getOneBySlug(slug: string): Promise<Category | undefined> {
    return this.categoryRepo.findOneOrFail({ where: { slug } });
  }
}
