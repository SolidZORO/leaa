import { v4 } from 'uuid';
import { isUUID as nestjsIsUUID } from '@nestjs/common/utils/is-uuid';

export const uuid = (): string => v4();

export const isUUID = nestjsIsUUID;
