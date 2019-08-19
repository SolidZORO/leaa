import React from 'react';

import { SwiperImage } from '@leaa/www/components/SwiperImage';
import { Ax } from '@leaa/common/src/entrys';

import style from './style.less';

interface IProps {
  ax: Ax;
}

export default (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      {props.ax &&
        props.ax.attachments &&
        props.ax.attachments.bannerMbList &&
        props.ax.attachments.bannerMbList.length !== 0 && (
          <SwiperImage
            lazy
            attachmentList={props.ax.attachments.bannerMbList}
            centerMode
            height={props.ax.attachments.bannerMbList[0].height}
          />
        )}
    </div>
  );
};
