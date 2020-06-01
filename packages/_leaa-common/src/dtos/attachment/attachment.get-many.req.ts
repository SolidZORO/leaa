import { IsOptional } from 'class-validator';

import { BaseGetManyReq } from '@leaa/common/src/dtos/_common';

export class AttachmentGetManyReq extends BaseGetManyReq {
  @IsOptional()
  type?: string;

  @IsOptional()
  moduleName?: string;

  @IsOptional()
  moduleId?: string;

  @IsOptional()
  typeName?: string;

  @IsOptional()
  typePlatform?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  userId?: string;

  @IsOptional()
  refreshHash?: number;
}
