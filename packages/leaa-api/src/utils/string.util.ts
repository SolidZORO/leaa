import { v4 } from 'uuid';
import crypto from 'crypto';
import Hashids from 'hashids/cjs';
import { envConfig } from '@leaa/api/src/modules/config/config.module';
import { IGqlCtx } from '@leaa/api/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils/msg.util';

const getSlug = (str: string, secondChoiceStr?: string): string => {
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

const random = (): string => {
  return v4().replace(/-/g, '');
};

const uuid = (): string => v4();

const md5 = (str: string): string => {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
};

// ABCDEFGHIJKLMNOPQRSTUVWXYZ - ABCDEFGHIJKMNPQRSTUVWXY
// abcdefghijklmnopqrstuvwxyz - abcdefghijkmnpqrstuvwxyz
// 0123456789 - 13456789
const hashids = new Hashids(envConfig.HASHIDS_SALT, 8, 'abcdefghijkmnpqrstuvwxyz123456789');

const encodeId = (n: number, gqlCtx?: IGqlCtx): string => {
  if (typeof n === 'undefined') throw msgUtil.error({ t: ['_error:notFoundId'], gqlCtx });

  const result = hashids.encode(n);

  if (!result) throw msgUtil.error({ t: ['_error:invalidId'], gqlCtx });

  return result;
};

const decodeId = (s: string, gqlCtx?: IGqlCtx): number => {
  if (typeof s === 'undefined') throw msgUtil.error({ t: ['_error:notFoundId'], gqlCtx });

  const result = Number(hashids.decode(s));

  if (Number.isNaN(result) || result === 0) throw msgUtil.error({ t: ['_error:invalidId'], gqlCtx });

  return result;
};

export const stringUtil = {
  getSlug,
  random,
  uuid,
  md5,
  encodeId,
  decodeId,
};
