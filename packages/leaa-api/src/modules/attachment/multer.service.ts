import path from 'path';
import mkdirp from 'mkdirp';
import multer from 'multer';
import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { isAt2x, uuid, logger } from '@leaa/api/src/utils';
import { attachmentConfig } from '@leaa/api/src/configs';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  destination = (
    // req: IRequest,
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ): void => {
    try {
      mkdirp.sync(attachmentConfig.SAVE_DIR_BY_DISK);
      cb(null, attachmentConfig.SAVE_DIR_BY_DISK);
    } catch (err) {
      logger.log(`MulterService [destination],
      mkdirp ${attachmentConfig.SAVE_DIR_BY_DISK} ${JSON.stringify(err)}`);
      throw Error(err.message);
    }
  };

  filename = (req: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
    const filename = file.originalname.toLowerCase();
    const at2x = isAt2x(filename) ? '_2x' : '';

    cb(null, `${uuid()}${at2x}${path.extname(filename)}`);
  };

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => this.destination(req, file, cb),
        filename: (req, file, cb) => this.filename(req, file, cb),
      }),
      limits: {
        fileSize: this.configService.ATTACHMENT_LIMIT_SIZE_MB * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const fileTypes = attachmentConfig.ALLOW_FILE_TYPES;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
          return cb(null, true);
        }

        return cb(null, false);
      },
    };
  }
}
