import React from 'react';
import cx from 'classnames';

import { Attachment } from '@leaa/common/entrys';
import { publicRuntimeConfig } from '@leaa/www/configs';

import style from './style.less';

interface IProps {
  // attachment: Attachment;
  attachment: Pick<Attachment, 'uuid' | 'path' | 'title' | 'alt' | 'at2x' | 'pathAt2x' | 'height' | 'width'>;
  height: number;
  className?: string;
}

export const RetinaBg = (props: IProps) => {
  const { attachment } = props;

  const at1x = `${publicRuntimeConfig.API_HOST}${attachment.path}`;
  const at2x = `${publicRuntimeConfig.API_HOST}${attachment.pathAt2x}`;

  let bgStyle;

  if (attachment.at2x) {
    bgStyle = {
      backgroundImage: `-webkit-image-set(url(${at2x}) 2x, url(${at1x}) 1x), url(${at1x})`,
    };
  } else {
    bgStyle = {
      backgroundImage: `url(${at1x})`,
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
