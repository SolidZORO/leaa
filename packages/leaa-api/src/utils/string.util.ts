import { v4 } from 'uuid';
import { slugify } from 'transliteration';
import { isUUID as nestjsIsUUID } from '@nestjs/common/utils/is-uuid';

export const uuid = (): string => v4();

export const genSlug = slugify;

export const isUUID = nestjsIsUUID;
