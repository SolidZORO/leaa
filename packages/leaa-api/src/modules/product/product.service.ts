import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Product, Category, Tag, User } from '@leaa/common/src/entrys';
import {
  ProductsArgs,
  ProductsWithPaginationObject,
  ProductArgs,
  CreateProductInput,
  UpdateProductInput,
} from '@leaa/common/src/dtos/product';
import { formatUtil, paginationUtil, curdUtil, stringUtil, dictUtil, authUtil } from '@leaa/api/src/utils';

import { TagService } from '@leaa/api/src/modules/tag/tag.service';

const CONSTRUCTOR_NAME = 'ProductService';

type IProductsArgs = ProductsArgs & FindOneOptions<Product>;
type IProductArgs = ProductArgs & FindOneOptions<Product>;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly tagService: TagService,
  ) {}

  async products(args: IProductsArgs, user?: User): Promise<ProductsWithPaginationObject> {
    const nextArgs: IProductsArgs = formatUtil.formatArgs(args);

    const PRIMARY_TABLE = 'products';
    const qb = await this.productRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.categories`, 'categories');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.tags`, 'tags');

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['title', 'slug'].forEach(key => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // tag
    if (nextArgs.tagName) {
      qb.andWhere('tags.name IN (:...tagName)', { tagName: nextArgs.tagName });
    }

    // category
    if (nextArgs.categoryName) {
      qb.andWhere('categories.name IN (:...categoryName)', { categoryName: nextArgs.categoryName });
    }

    if (nextArgs.categoryId) {
      qb.andWhere('categories.id IN (:...categoryId)', { categoryId: nextArgs.categoryId });
    }

    // order
    qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);

    // can
    if (!user && !(user && authUtil.can(user, 'product.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async product(id: number, args?: IProductArgs, user?: User): Promise<Product | undefined> {
    let nextArgs: IProductArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['tags', 'categories'];
    }

    // can
    if (!(user && authUtil.can(user, 'product.item-read--all-status'))) {
      nextArgs.where = { status: 1 };
    }

    return this.productRepository.findOne(id, nextArgs);
  }

  async createProduct(args: CreateProductInput): Promise<Product | undefined> {
    const relationArgs: { categories?: Category[] } = {};

    return this.productRepository.save({ ...args, ...relationArgs });
  }

  async updateProduct(id: number, args: UpdateProductInput): Promise<Product | undefined> {
    const relationArgs: { tags?: Tag[]; categories?: Category[] } = {};

    const trimSlug = args.slug ? args.slug.trim().toLowerCase() : args.slug;
    const trimDescription = args.description ? args.description.trim() : args.description;

    // tags
    let tagObjects;
    if (args.tagIds && args.tagIds.length > 0) {
      tagObjects = await this.tagRepository.findByIds(args.tagIds);
    }
    relationArgs.tags = tagObjects;

    // category
    let categoryObjects;
    if (args.categoryIds) {
      categoryObjects = await this.categoryRepository.findByIds(args.categoryIds);
    }
    relationArgs.categories = categoryObjects;

    const nextArgs = {
      ...args,
      slug: !args.slug && args.title ? stringUtil.getSlug(args.title, args.title) : trimSlug,
      description: trimDescription,
    };

    // auto add tag from product content (by jieba)
    if (args.content && (!args.tagIds || (args.tagIds && args.tagIds.length === 0))) {
      const allText = formatUtil.formatHtmlToText(args.content, args.title);

      // batch create tags
      relationArgs.tags = await this.tagService.createTags(dictUtil.cutTags(allText));

      // ⚠️ sync tags
      // execute only once when the product has no tag, reducing server pressure
      await this.tagService.syncTagsToDictFile();
    }

    return curdUtil.commonUpdate(this.productRepository, CONSTRUCTOR_NAME, id, nextArgs, relationArgs);
  }

  async deleteProduct(id: number): Promise<Product | undefined> {
    return curdUtil.commonDelete(this.productRepository, CONSTRUCTOR_NAME, id);
  }
}
