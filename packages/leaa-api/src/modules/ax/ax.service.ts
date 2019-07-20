import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax, Attachment, User } from '@leaa/common/entrys';
import {
  AxsArgs,
  AxsWithPaginationObject,
  AxArgs,
  CreateAxInput,
  UpdateAxInput,
  AxAttachmentsObject,
} from '@leaa/common/dtos/ax';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil, loggerUtil } from '@leaa/api/utils';
import { AttachmentService } from '@leaa/api/modules/attachment/attachment.service';

const CONSTRUCTOR_NAME = 'AxService';

@Injectable()
export class AxService extends BaseService<Ax, AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput> {
  constructor(
    @InjectRepository(Ax) private readonly axRepository: Repository<Ax>,
    private readonly attachmentService: AttachmentService,
  ) {
    super(axRepository);
  }

  async getAttachments(ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    let bannerMbList: Attachment[] = [];
    let bannerPcList: Attachment[] = [];
    let galleryMbList: Attachment[] = [];
    let galleryPcList: Attachment[] = [];

    if (ax && ax.id) {
      const baseParam = {
        moduleName: 'ax',
        moduleId: ax.id,
        moduleType: 'banner_mb',
      };

      const bannerMbResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'banner_mb' });
      const bannerPcResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'banner_pc' });
      const galleryMbResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'gallery_mb' });
      const galleryPcResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'gallery_pc' });

      if (bannerMbResult && bannerMbResult.items) {
        bannerMbList = bannerMbResult.items;
      }

      if (bannerPcResult && bannerPcResult.items) {
        bannerPcList = bannerPcResult.items;
      }

      if (galleryMbResult && galleryMbResult.items) {
        galleryMbList = galleryMbResult.items;
      }

      if (galleryPcResult && galleryPcResult.items) {
        galleryPcList = galleryPcResult.items;
      }
    }

    return {
      bannerMbList,
      bannerPcList,
      galleryMbList,
      galleryPcList,
    };
  }

  async axs(args: AxsArgs): Promise<AxsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ slug: qLike }, { title: qLike }];
    }

    const [items, total] = await this.axRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async ax(id: number, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    let nextArgs: FindOneOptions<Ax> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery = {
      id,
      status: 1,
    };

    if (user && user.flatePermissions && user.flatePermissions.includes('article.item')) {
      delete whereQuery.status;
    }

    return this.axRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async axBySlug(slug: string, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    const ax = await this.axRepository.findOne({ where: { slug } });

    if (!ax) {
      const message = 'not found ax';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.ax(ax.id, args, user);
  }

  async craeteAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: number, args: UpdateAxInput): Promise<Ax | undefined> {
    return this.update(id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    return this.delete(id);
  }
}
