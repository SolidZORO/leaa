import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Product, Category, Tag, Attachment } from '@leaa/common/src/entrys';
import { ProductsWithPaginationObject, CreateProductInput, UpdateProductInput } from '@leaa/common/src/dtos/product';
import { argsUtil, paginationUtil, curdUtil, authUtil } from '@leaa/api/src/utils';
import { IProductsArgs, IProductArgs, IGqlCtx } from '@leaa/api/src/interfaces';

import { TagService } from '@leaa/api/src/modules/tag/tag.service';

const CLS_NAME = 'ProductService';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly tagService: TagService,
  ) {}

  async products(args: IProductsArgs, gqlCtx?: IGqlCtx): Promise<ProductsWithPaginationObject | undefined> {
    const nextArgs: IProductsArgs = argsUtil.format(args, gqlCtx);

    const PRIMARY_TABLE = 'products';
    const qb = await this.productRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.styles`, 'styles');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.brands`, 'brands');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.tags`, 'tags');

    // tag
    if (nextArgs.tagName) qb.andWhere('tags.name IN (:...tagName)', { tagName: nextArgs.tagName });

    if (nextArgs.styleId) qb.andWhere('styles.id IN (:...styleId)', { styleId: nextArgs.styleId });
    if (nextArgs.brandId) qb.andWhere('brands.id IN (:...brandId)', { brandId: nextArgs.brandId });
    if (nextArgs.styleName) qb.andWhere('styles.name IN (:...styleName)', { styleName: nextArgs.styleName });
    if (nextArgs.brandName) qb.andWhere('brands.name IN (:...brandName)', { brandName: nextArgs.brandName });

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['name'].forEach(key => {
        qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !authUtil.can(gqlCtx.user, 'product.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async product(id: number, args?: IProductArgs, gqlCtx?: IGqlCtx): Promise<Product | undefined> {
    const PRIMARY_TABLE = 'products';
    const qb = await this.productRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.styles`, 'styles');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.brands`, 'brands');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.tags`, 'tags');

    return qb.where({ id }).getOne();
  }

  async formatArgs(
    args: CreateProductInput | UpdateProductInput,
  ): Promise<{
    nextArgs: Pick<Product, 'tags' | 'styles' | 'brands' | 'description'> & (CreateProductInput | UpdateProductInput);
    nextRelation: any;
  }> {
    const nextRelation: { tags?: Tag[]; styles?: Category[]; brands?: Category[] } = {};

    const trimDescription = args.description ? args.description.trim() : args.description;

    // tags
    let tags;
    if (args.tagIds && args.tagIds.length > 0) {
      tags = await this.tagRepository.findByIds(args.tagIds);
    }

    // styles
    let styles;
    if (args.styleIds && args.styleIds.length > 0) {
      styles = await this.categoryRepository.findByIds(args.styleIds);
    }

    // brans
    let brands;
    if (args.brandIds && args.brandIds.length > 0) {
      brands = await this.categoryRepository.findByIds(args.brandIds);
    }

    return {
      nextArgs: {
        ...args,
        description: trimDescription,
        styles,
        brands,
        tags,
      },
      nextRelation,
    };
  }

  async createProduct(args: CreateProductInput, gqlCtx?: IGqlCtx): Promise<Product | undefined> {
    const { nextRelation, nextArgs } = await this.formatArgs(args);

    return this.productRepository.save({ ...nextArgs, ...nextRelation });
  }

  async updateProduct(id: number, args: UpdateProductInput, gqlCtx?: IGqlCtx): Promise<Product | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.productRepository, CLS_NAME, id, args);

    const { nextRelation, nextArgs } = await this.formatArgs(args);

    // auto add tag from product content (by jieba)
    if (nextArgs.content && (!nextArgs.tagIds || (nextArgs.tagIds && nextArgs.tagIds.length === 0))) {
      // ⚠️ sync tags
      // execute only once when the product has no tag, reducing server pressure
      await this.tagService.syncTagsToDictFile();
    }

    return curdUtil.commonUpdate(this.productRepository, CLS_NAME, id, nextArgs, nextRelation);
  }

  async deleteProduct(id: number, gqlCtx?: IGqlCtx): Promise<Product | undefined> {
    return curdUtil.commonDelete(this.productRepository, CLS_NAME, id);
  }
}
