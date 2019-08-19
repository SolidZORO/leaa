import React from 'react';
import cx from 'classnames';

import { Attachment } from '@leaa/common/src/entrys';

import style from './style.less';

interface IProps {
  // attachment: Attachment;
  attachment: Pick<Attachment, 'uuid' | 'path' | 'title' | 'alt' | 'at2x' | 'url' | 'urlAt2x' | 'height' | 'width'>;
  height: number;
  className?: string;
}

export const RetinaBg = (props: IProps) => {
  const { attachment } = props;

  let bgStyle;

  if (attachment.at2x) {
    bgStyle = {
      // eslint-disable-next-line max-len
      backgroundImage: `-webkit-image-set(url(${attachment.urlAt2x}) 2x, url(${attachment.url}) 1x), url(${attachment.url})`,
    };
  } else {
    bgStyle = {
      backgroundImage: `url(${attachment.url})`,
    };
  }

  return (
    <div // eslint-disable-line
      className={cx(style['background-center-image'], 'g-background-center-image', props.className)}
      style={{
        ...bgStyle,
        height: props.height,
      }}
    />
  );
};
