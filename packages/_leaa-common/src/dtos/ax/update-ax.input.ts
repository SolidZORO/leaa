import { IsOptional } from 'class-validator';
import { Attachment } from '@leaa/common/src/entrys';

export class UpdateAxInput {
  @IsOptional()
  title?: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  attachments?: Attachment[];
}
