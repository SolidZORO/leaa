import { IsNotEmpty, IsOptional } from 'class-validator';

import { Attachment } from '@leaa/common/src/entrys';

export class AxCreateOneReq {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  slug!: string;

  @IsNotEmpty()
  status!: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  attachments?: Attachment[];
}
