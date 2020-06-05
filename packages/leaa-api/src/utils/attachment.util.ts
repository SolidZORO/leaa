import crypto from 'crypto';
import { Attachment } from '@leaa/api/src/entrys';
import { attachmentConfig } from '@leaa/api/src/configs';
import { envConfig } from '@leaa/api/src/modules/v1/config/config.module';
import { getAt2xPath } from '@leaa/api/src/utils/path.util';

export const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

export const filenameAt1xToAt2x = (filename: string): string => {
  const ext = `.${filename.split('.').pop()}`;

  return filename.replace(ext, `_2x${ext}`);
};

type IAttachment = Pick<Attachment, 'in_oss' | 'in_local' | 'path' | 'external_url'>;

export const genUrl = (attachment: IAttachment): string | null => {
  if (attachment.external_url) {
    const externalUrls = attachment.external_url.split('|');

    return externalUrls[0];
  }

  if (attachment.in_oss) {
    return `${attachmentConfig.URL_PREFIX_BY_OSS}${attachment.path}`;
  }

  if (attachment.in_local) {
    return `${attachmentConfig.URL_PREFIX_BY_LOCAL}${attachment.path}`;
  }

  return null;
};

export const genUrlAt2x = (attachment: Attachment): string | null => {
  if (attachment.external_url) {
    const externalUrls = attachment.external_url.split('|');

    return externalUrls[1] || externalUrls[0];
  }

  if (attachment.at2x) {
    return getAt2xPath(genUrl(attachment));
  }

  return null;
};

// set default avatar @see https://cn.gravatar.com/site/implement/images/
//
// avatarType
// 404: do not load any image if none is associated with the email hash
// mp: (mystery-person) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)
// identicon: a geometric pattern based on an email hash
// monsterid: a generated 'monster' with different colors, faces, etc
// wavatar: generated faces with differing features and backgrounds
// retro: awesome generated, 8-bit arcade-style pixelated faces
// robohash: a generated robot with different colors, faces, etc
// blank: a transparent PNG image (border added to HTML below for demonstration purposes)
export const GRAVATAR_AVATAR_TYPE = envConfig.GRAVATAR_TYPE || 'monsterid';
export const GRAVATAR_AVATAR_PARAMS = `?s=160&d=${GRAVATAR_AVATAR_TYPE}`;

export const transAvatarUrl = (path?: string | null): string | null => {
  if (path?.includes('gravatar.com')) return `${path}${GRAVATAR_AVATAR_PARAMS}`;

  if (path?.includes('/attachments/') && !path?.includes('http')) {
    return `${attachmentConfig.URL_PREFIX_BY_AUTO}${path}`;
  }

  return path || '';
};

export const genAvatarUrl = (hash?: string): string => {
  const hashMd5 = crypto
    .createHash('md5')
    .update(hash || `hash-${new Date().valueOf()}`)
    .digest('hex');

  return `//secure.gravatar.com/avatar/${hashMd5}`;
};
