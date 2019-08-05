import React from 'react';

import { Attachment } from '@leaa/common/entrys';
import { envConfig } from '@leaa/www/configs';

interface IProps {
  // attachment: Attachment;
  attachment: Pick<Attachment, 'uuid' | 'path' | 'title' | 'alt' | 'at2x' | 'pathAt2x' | 'height' | 'width'>;
  className?: string;
  lazy?: boolean;
}

export const RetinaImage = (props: IProps) => {
  const { attachment } = props;

  const at1x = `${envConfig.API_HOST}${attachment.path}`;
  const at2x = `${envConfig.API_HOST}${attachment.pathAt2x}`;

  const lazyProps = props.lazy
    ? {
        'data-src': at1x,
        'data-srcset': attachment.at2x ? `${at2x} 2x` : undefined,
        className: 'swiper-lazy',
      }
    : {
        srcSet: attachment.at2x ? `${at2x} 2x, ${at1x} 1x` : `${at1x} 1x`,
        src: `${at1x}`,
      };

  return <img alt={attachment.alt} title={attachment.title} className={props.className} {...lazyProps} />;
};
