import { v4 } from 'uuid';
import crypto from 'crypto';
import { isUUID as nestjsIsUUID } from '@nestjs/common/utils/is-uuid';

export const getSlug = (str: string, secondChoiceStr?: string): string => {
  const trimStr = str ? str.trim().toLowerCase() : str;

  let nextStr = trimStr;

  if (/[\w]/.test(trimStr)) {
    nextStr = trimStr
      .replace(/[^\w\-\s]/g, '-') // remove `non-english` to `-`
      .replace(/\s/g, '-') // remove `space` to `-`
      .replace(/-+/g, '-') // remove `--` to `-`
      .replace(/^-(.*)/g, '$1') // remove frist `-`
      .replace(/(.*)-$/g, '$1'); // remove last `-`
  }

  if (!nextStr && secondChoiceStr) {
    nextStr = secondChoiceStr;
  }

  return nextStr;
};

export const randomString = (): string => {
  return v4().replace(/-/g, '');
};

export const uuid = (): string => v4();

export const isUUID = nestjsIsUUID;

export const md5 = (str: string): string => {
  return crypto.createHash('md5').update(str).digest('hex');
};
