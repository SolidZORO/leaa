import { Controller, Get, HttpCode, Body, UseInterceptors, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { AttachmentService } from '@leaa/api/src/modules/v1/attachment/attachment.service';
import { SaveInOssService } from '@leaa/api/src/modules/v1/attachment/save-in-oss.service';
import { ICraeteAttachmentByOssCallback, IAttachmentParams } from '@leaa/common/src/interfaces';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { Attachment } from '@leaa/common/src/entrys';
import { Permissions } from '@leaa/api/src/decorators';
import {
  CreateAttachmentInput,
  UpdateAttachmentInput,
  UpdateAttachmentsInput,
  BatchUpdateAttachmentsSortInput,
} from '@leaa/common/src/dtos/attachment';

@Crud({
  model: { type: Attachment },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 1000,
    alwaysPaginate: true,
    // sort: [{ field: 'created_at', order: 'DESC' }],
  },
  routes: {
    // upload file, will be auto create
    exclude: ['createOneBase'],
    // getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.list-read')] },
    // getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-read')] },
    // createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-update')] },
    deleteOneBase: { returnDeleted: true },
  },
  dto: {
    create: CreateAttachmentInput,
    update: UpdateAttachmentInput,
    replace: Attachment,
  },
})
@Controller('/v1/attachments')
export class AttachmentController implements CrudController<Attachment> {
  constructor(public readonly service: AttachmentService, private readonly saveInOssService: SaveInOssService) {}

  @Override('deleteOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-delete')
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<Attachment | void> {
    return this.service.deleteOne(req);
  }

  //
  //

  @Get('signature')
  async getSignature() {
    return this.service.getSignature();
  }

  @HttpCode(200)
  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body: IAttachmentParams, @UploadedFile() file: Express.Multer.File) {
    return this.service.createAttachmentByLocal(body, file);
  }

  @HttpCode(200)
  @Get('oss/callback')
  async ossCallbackTips() {
    return 'METHOD ERROR, PLS CHANGE TO POST.';
  }

  @HttpCode(200)
  @Post('oss/callback')
  async ossCallback(@Body() req: ICraeteAttachmentByOssCallback) {
    return this.saveInOssService.ossCallback(req);
  }

  @Post('batch')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-update')
  batchUpdate(@Body() dto: UpdateAttachmentsInput): Promise<string> {
    return this.service.batchUpdate(dto);
  }

  @Post('batch-sort')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-update')
  batchUpdateSort(@Body() dto: BatchUpdateAttachmentsSortInput): Promise<string> {
    return this.service.batchUpdateSort(dto);
  }
}
