import React from 'react';

import { Attachment } from '@leaa/common/entrys';

interface IProps {
  // attachment: Attachment;
  attachment: Pick<Attachment, 'uuid' | 'path' | 'title' | 'alt' | 'at2x' | 'url' | 'urlAt2x' | 'height' | 'width'>;
  className?: string;
  lazy?: boolean;
}

export const RetinaImage = (props: IProps) => {
  const { attachment } = props;

  const lazyProps = props.lazy
    ? {
        'data-src': attachment.url,
        'data-srcset': attachment.at2x ? `${attachment.urlAt2x} 2x` : undefined,
        className: 'swiper-lazy',
      }
    : {
        srcSet: attachment.urlAt2x ? `${attachment.urlAt2x} 2x, ${attachment.url} 1x` : `${attachment.url} 1x`,
        src: `${attachment.url}`,
      };

  return <img alt={attachment.alt} title={attachment.title} className={props.className} {...lazyProps} />;
};
