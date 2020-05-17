import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Category } from '@leaa/common/src/entrys';
import { Repository, TreeRepository, getManager } from 'typeorm';
import moment from 'moment';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { CategoryTreeObject } from '@leaa/common/src/dtos/category';
import { CrudController, Override, CrudRequest } from '@nestjsx/crud';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo: TreeRepository<Category>) {
    super(repo as TreeRepository<Category>);
  }

  async tree(options?: ICategoriesQuery) {
    const categories = await (this.repo as TreeRepository<Category>).findTrees();

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

    const recursiveItems = (categories: Category[]) => {
      return categories.map((category) => {
        if (category.children && Array.isArray(category.children) && category.children.length > 0) {
          // eslint-disable-next-line no-param-reassign
          category.children = recursiveItems(category.children);
        }

        return appendInfoToItem(category);
      });
    };

    const result = recursiveItems(items);

    // if (args && (args.parentId || args.parentSlug)) return result;

    return [this.rootCategory(result)];
  }
}
