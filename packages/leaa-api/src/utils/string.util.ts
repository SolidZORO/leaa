import { v4 } from 'uuid';
import crypto from 'crypto';
import Hashids from 'hashids/cjs';
import { envConfig } from '@leaa/api/src/modules/config/config.module';
import { IGqlCtx } from '@leaa/api/src/interfaces';
import { msgError } from '@leaa/api/src/utils/msg.util';

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

export const md5 = (str: string): string => {
  return crypto.createHash('md5').update(str).digest('hex');
};

// ABCDEFGHIJKLMNOPQRSTUVWXYZ - ABCDEFGHIJKMNPQRSTUVWXY
// abcdefghijklmnopqrstuvwxyz - abcdefghijkmnpqrstuvwxyz
// 0123456789 - 13456789
export const hashids = new Hashids(envConfig.HASHIDS_SALT, 8, 'abcdefghijkmnpqrstuvwxyz123456789');

export const encodeId = (n: number, gqlCtx?: IGqlCtx): string => {
  console.log('encodeId-encodeId-encodeId-encodeId-encodeId');
  if (typeof n === 'undefined') throw msgError({ t: ['_error:notFoundId'], gqlCtx });

  const result = hashids.encode(n);

  if (!result) throw msgError({ t: ['_error:invalidHashId'], gqlCtx });

  return result;
};

export const decodeId = (s: string, gqlCtx?: IGqlCtx): number => {
  console.log('decodeId-decodeId-decodeId-decodeId-decodeId');
  if (typeof s === 'undefined') throw msgError({ t: ['_error:notFoundId'], gqlCtx });

  const result = Number(hashids.decode(s));

  if (Number.isNaN(result) || result === 0) throw msgError({ t: ['_error:invalidHashId'], gqlCtx });

  return result;
};
