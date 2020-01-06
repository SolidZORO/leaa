import fs from 'fs';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';

import { Attachment } from '@leaa/common/src/entrys';
import { CreateAttachmentInput, UpdateAttachmentInput } from '@leaa/common/src/dtos/attachment';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import { AttachmentProperty } from '@leaa/api/src/modules/attachment/attachment.property';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { MulterService } from '@leaa/api/src/modules/attachment/multer.service';
import { AttachmentResolver } from '@leaa/api/src/modules/attachment/attachment.resolver';
import { SaveInOssService } from '@leaa/api/src/modules/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/src/modules/attachment/save-in-local.service';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let multerService: MulterService;
  const ATTACHMENT_REPOSITORY_MOCK: Repository<Attachment> = new Repository<Attachment>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentResolver,
        AttachmentService,
        AttachmentProperty,
        MulterService,
        SaveInLocalService,
        SaveInOssService,
        ConfigService,
        MulterService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: ATTACHMENT_REPOSITORY_MOCK,
        },
      ],
    }).compile();

    attachmentService = module.get<AttachmentService>(AttachmentService);
    multerService = module.get<MulterService>(MulterService);
  });

  it('should be server defined', () => {
    expect(attachmentService).toBeDefined();
  });

  let attachmentObject = new Attachment();

  describe('uploadAttachment', () => {
    const createAttachmentBase = {
      uuid: '0427ba2e-c555-484a-89ba-dd5673787018',
      title: 'images-3',
      alt: 'images-3',
      type: 'image',
      filename: '0427ba2e-c555-484a-89ba-dd5673787018.jpg',
      ext: '.jpg',
      width: 225,
      height: 225,
      size: 7768,
      path: '/attachments/2019/08/0427ba2e-c555-484a-89ba-dd5673787018.jpg',
      at2x: 0,
      in_local: 0,
      in_oss: 0,
      user_id: null,
      sort: 0,
      status: 1,
    };

    const createAttachmentInput: CreateAttachmentInput = {
      ...createAttachmentBase,
      moduleName: 'ax',
      moduleId: 1,
      typeName: 'banner',
      typePlatform: 'mb',
    };

    attachmentObject = {
      ...createAttachmentBase,
      id: 1,
      module_id: createAttachmentInput.moduleId,
      module_name: createAttachmentInput.moduleName,
      type_name: createAttachmentInput.typeName,
      type_platform: createAttachmentInput.typePlatform,
      created_at: new Date(),
    };

    const fileBase = {
      fieldname: 'file',
      encoding: '',
      mimetype: 'image/png',
      size: 7768,
      destination: '',
      filename: 'test_1x.png',
      path: 'test_1x.png',
      location: '',
    };

    it('should upload attachment _1x', async () => {
      const file: Express.Multer.File = {
        ...fileBase,
        originalname: 'test_1x.png',
        buffer: Buffer.from(fs.readFileSync(`${__dirname}/__mock__/test_1x.png`)),
      };

      const attachment1xObject = {
        ...attachmentObject,
        at2x: 0,
      };

      const createAttachment1xInput = {
        ...createAttachmentInput,
        at2x: 0,
      };

      jest.spyOn(attachmentService, 'createAttachmentByLocal').mockImplementation(async () => ({
        attachment: attachmentObject,
      }));

      const result = await attachmentService.createAttachmentByLocal(createAttachment1xInput, file);

      expect(result).toEqual({ attachment: attachment1xObject });
    });

    it('should upload attachment _2x', async () => {
      const file: Express.Multer.File = {
        ...fileBase,
        originalname: 'test_2x.png',
        buffer: Buffer.from(fs.readFileSync(`${__dirname}/__mock__/test_2x.png`)),
      };

      const attachment1xObject = {
        ...attachmentObject,
        at2x: 0,
      };

      const createAttachment1xInput = {
        ...createAttachmentInput,
        at2x: 0,
      };

      jest.spyOn(attachmentService, 'createAttachmentByLocal').mockImplementation(async () => ({
        attachment: attachmentObject,
      }));

      const result = await attachmentService.createAttachmentByLocal(createAttachment1xInput, file);

      expect(result).toEqual({ attachment: attachment1xObject });
    });
  });

  describe('updateAttachment', () => {
    const updateAttachmentInput: UpdateAttachmentInput = { title: 'image title', sort: 11, status: 1 };

    const updatedAttachment: Attachment = {
      ...attachmentObject,
      ...updateAttachmentInput,
    };

    it('should update attachment', async () => {
      jest.spyOn(attachmentService, 'updateAttachment').mockImplementation(async () => updatedAttachment);

      const result = await attachmentService.updateAttachment(
        '0427ba2e-c555-484a-89ba-dd5673787018',
        updateAttachmentInput,
      );

      expect(result).toBe(updatedAttachment);
    });
  });

  describe('getAttachment', () => {
    const attachmentsObject = {
      items: [attachmentObject, attachmentObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return attachments', async () => {
      jest.spyOn(attachmentService, 'attachments').mockImplementation(async () => attachmentsObject);
      const result = await attachmentService.attachments({});

      expect(result).toBe(attachmentsObject);
    });

    it('should return attachment', async () => {
      jest.spyOn(attachmentService, 'attachment').mockImplementation(async () => attachmentObject);
      const result = await attachmentService.attachment('0427ba2e-c555-484a-89ba-dd5673787018');

      expect(result).toBe(attachmentObject);
    });

    it('should return attachment (undefined)', async () => {
      jest.spyOn(attachmentService, 'attachment').mockImplementation(async () => undefined);
      const result = await attachmentService.attachment('');

      expect(result).toBe(undefined);
    });
  });

  describe('deleteAttachment', () => {
    const deleteParam = ['0427ba2e-c555-484a-89ba-dd5673787018'];

    const deletedAttachment = {
      items: deleteParam,
    };

    it('should delete attachment', async () => {
      jest.spyOn(attachmentService, 'deleteAttachments').mockImplementation(async () => deletedAttachment);
      const result = await attachmentService.deleteAttachments(deleteParam);

      expect(result).toBe(deletedAttachment);
    });
  });
});
