import { Controller, Get, Req, Body, UseInterceptors, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
import { JwtGuard } from '@leaa/api/guards/jwt.guard';
import { AttachmentService } from '@leaa/api/modules/attachment/attachment.service';

@Controller('/attachments')
@UseGuards(JwtGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('')
  async test() {
    return '<code>-- NOT FOUND ATTACHMENT --</code>';
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: Request,
    @Body() body: CreateAttachmentInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentService.craeteAttachment(req, body, file);
  }
}
