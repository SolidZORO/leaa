import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '@leaa/common/src/entrys';
import {
  CategoriesWithPaginationOrTreeObject,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryTreeObject,
} from '@leaa/common/src/dtos/category';
import { argsFormat, commonUpdate, commonDelete, isOneField, calcQbPageInfo, errorMsg } from '@leaa/api/src/utils';
import { ICategoriesArgs, ICategoryArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { categorySeed } from '@leaa/api/src/modules/seed/seed.data';

const CLS_NAME = 'CategoryService';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx: IGqlCtx, id?: string): Promise<boolean> {
    const { t } = gqlCtx;

    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const c = await this.category(gqlCtx, id);

      if (c && c.slug && categorySeed.map((seed) => seed.slug).includes(c.slug)) {
        throw errorMsg(t('_error:pleaseDontModify'), { gqlCtx });
      }
    }

    return true;
  }

  rootCategory(children?: any[]) {
    return {
      key: '0-0-0-root',
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

  categoriesByTrees(items: Category[], args?: ICategoriesArgs): CategoryTreeObject[] {
    const appendInfoToItem = (item: Category): Omit<CategoryTreeObject, 'children'> => ({
      ...item,
      key: `${item.parent_id}-${item.id}-${item.slug}`,
      //
      title: `${item.name}`,
      subtitle: item.slug,
      value: item.id,
      expanded: args && args.expanded,
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

    if (args && (args.parentId || args.parentSlug)) return result;

    return [this.rootCategory(result)];
  }

  async categories(gqlCtx: IGqlCtx, args: ICategoriesArgs): Promise<CategoriesWithPaginationOrTreeObject | undefined> {
    const nextArgs: ICategoriesArgs = argsFormat(args, gqlCtx);

    const qb = this.categoryRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach((q) => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    if (nextArgs.treeType) {
      const manager = getManager();

      // pick parent slug OR id
      if (nextArgs.parentSlug || nextArgs.parentId) {
        let where;
        if (nextArgs.parentSlug) where = { slug: nextArgs.parentSlug };
        if (nextArgs.parentId) where = { id: nextArgs.parentId };

        const parent = await this.categoryRepository.findOne({ where });

        if (parent) {
          const trees = await manager.getTreeRepository(Category).findDescendantsTree(parent);

          if (trees && trees.children && trees.children.length) {
            return { trees: this.categoriesByTrees(nextArgs.includeParent ? [trees] : trees.children, nextArgs) };
          }
        }

        return { trees: [] };
      }

      // all trees
      const trees = await manager.getTreeRepository(Category).findTrees();

      return { trees: this.categoriesByTrees(trees, nextArgs) };
    }

    return calcQbPageInfo({
      qb,
      page: nextArgs.page,
      pageSize: nextArgs.pageSize,
    });
  }

  async category(gqlCtx: IGqlCtx, id: string, args?: ICategoryArgs): Promise<Category | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });

    let nextArgs: ICategoryArgs = {};
    if (args) nextArgs = args;

    return this.categoryRepository.findOne(id, nextArgs);
  }

  async categoryBySlug(gqlCtx: IGqlCtx, slug: string, args?: ICategoryArgs): Promise<Category | undefined> {
    const { t } = gqlCtx;

    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) throw errorMsg(t('_error:notFoundItem'), { gqlCtx });

    return this.category(gqlCtx, category.id, args);
  }

  async createCategory(gqlCtx: IGqlCtx, args: CreateCategoryInput): Promise<Category | undefined> {
    const { t } = gqlCtx;

    if (!args || (args && !args.slug)) throw errorMsg(t('_error:notFoundField'), { gqlCtx });

    const manager = getManager();
    const newCategory = new Category();

    newCategory.name = args.name;
    newCategory.slug = args.slug;
    newCategory.description = args.description;
    newCategory.parent_id = args.parent_id || null;

    if (args.parent_id) {
      const parent = await this.category(gqlCtx, args.parent_id);

      if (parent) {
        newCategory.parent = parent;
      }
    }

    return manager.save(newCategory);
  }

  async updateCategory(gqlCtx: IGqlCtx, id: string, args: UpdateCategoryInput): Promise<Category | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx, id);

    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.categoryRepository, CLS_NAME, id, args, gqlCtx });
    }

    const nextArgs = args;

    if (typeof args.parent_id !== 'undefined') {
      const parent = await this.category(gqlCtx, args.parent_id || '');

      if (parent) {
        nextArgs.parent = parent;
      } else {
        nextArgs.parent = null;
        nextArgs.parent_id = null;
      }
    }

    return commonUpdate({ repository: this.categoryRepository, CLS_NAME, id, args: nextArgs, gqlCtx });
  }

  async deleteCategory(gqlCtx: IGqlCtx, id: string): Promise<Category | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx, id);

    return commonDelete({ repository: this.categoryRepository, CLS_NAME, id, gqlCtx });
  }
}
