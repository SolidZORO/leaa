import { Controller, Get, HttpCode, Body, UseInterceptors, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { AttachmentService } from '@leaa/api/src/modules/v1/attachment/attachment.service';
import { SaveInOssAliyunService } from '@leaa/api/src/modules/v1/attachment/save-in-oss-aliyun.service';
import { ICraeteAttachmentByOssCallback, IAttachmentParams } from '@leaa/common/src/interfaces';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { Attachment } from '@leaa/common/src/entrys';
import { Permissions } from '@leaa/api/src/decorators';
import {
  AttachmentCreateOneReq,
  AttachmentUpdateOneReq,
  AttachmentUpdateManyReq,
  AttachmentUpdateManySortReq,
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
    exclude: ['createOneBase', 'createManyBase'],
    // getManyBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.list-read')] },
    // getOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-read')] },
    // createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('attachment.item-update')] },
    deleteOneBase: { returnDeleted: true },
  },
  dto: {
    create: AttachmentCreateOneReq,
    update: AttachmentUpdateOneReq,
    replace: Attachment,
  },
})
@Controller('/v1/attachments')
export class AttachmentController implements CrudController<Attachment> {
  constructor(
    public readonly service: AttachmentService,
    private readonly saveInOssAliyunService: SaveInOssAliyunService,
  ) {}

  @Override('deleteOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-delete')
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<Attachment | void> {
    return this.service.deleteOne(req);
  }

  //
  //

  /**
   * @ideaNotes
   * 在 upload 之前，会先给一个 data 到 client，告诉他应该往哪里传文件。
   * 如果只开启了 ATTACHMENT_SAVE_IN_LOCAL，那就直接调用下面的 uploadFile 方法，
   * 然后如果开了 ATTACHMENT_SAVE_IN_OSS，那 client 就直接传到 aliyun，然后 aliyun 会 POST 给下面的 ossCallback 去下载文件。
   */
  @Get('signature')
  async getSignature() {
    return this.service.getSignature();
  }

  @HttpCode(200)
  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body: IAttachmentParams, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadFile(body, file);
  }

  @HttpCode(200)
  @Post('oss/callback')
  async ossCallback(@Body() req: ICraeteAttachmentByOssCallback) {
    return this.saveInOssAliyunService.ossCallback(req);
  }

  //
  //

  @Post('batch')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-update')
  batchUpdate(@Body() dto: AttachmentUpdateManyReq): Promise<string> {
    return this.service.batchUpdate(dto);
  }

  @Post('batch-sort')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('attachment.item-update')
  batchUpdateSort(@Body() dto: AttachmentUpdateManySortReq): Promise<string> {
    return this.service.batchUpdateSort(dto);
  }
}
