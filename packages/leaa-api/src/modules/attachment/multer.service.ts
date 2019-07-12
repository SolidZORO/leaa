import uuid from 'uuid';
import path from 'path';
import moment from 'moment';
import mkdirp from 'mkdirp';
import multer from 'multer';
import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ConfigService } from '@leaa/api/modules/config/config.service';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const subDir = moment().format('YYYY/MM');
          const dir = `./${this.configService.PUBLIC_DIR}/${this.configService.ATTACHMENT_DIR}/${subDir}`;

          mkdirp(dir, err => cb(err, dir));
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid.v4()}${path.extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: this.configService.ATTACHMENT_LIMIT_SIZE_BY_MB * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const fileTypes = /image|jpeg|jpg|png|gif|webp|pdf|text/;
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
