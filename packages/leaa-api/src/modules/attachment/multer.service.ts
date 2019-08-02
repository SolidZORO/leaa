import uuid from 'uuid';
import path from 'path';
import moment from 'moment';
import mkdirp from 'mkdirp';
import multer from 'multer';
import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ConfigService } from '@leaa/api/modules/config/config.service';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public subDir = moment().format('YYYY/MM');
  public saveDir = `./${this.configService.PUBLIC_DIR}/${this.configService.ATTACHMENT_DIR}/${this.subDir}`;
  public isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

  public destination = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ): void => {
    mkdirp(this.saveDir, err => cb(err, this.saveDir));
  };

  public filename = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void => {
    const at2x = this.isAt2x(file.originalname) ? '_2x' : '';

    cb(null, `${uuid.v4()}${at2x}${path.extname(file.originalname)}`);
  };

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => this.destination(req, file, cb),
        filename: (req, file, cb) => this.filename(req, file, cb),
      }),
      limits: {
        fileSize: this.configService.ATTACHMENT_LIMIT_SIZE_BY_MB * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const fileTypes = /image|jpeg|jpg|png|gif|webp|pdf|text|mp4|mp3/;
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
