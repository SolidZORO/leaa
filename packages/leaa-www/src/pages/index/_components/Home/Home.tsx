import React from 'react';

import { Ax } from '@leaa/common/src/entrys';
import { SwiperImage } from '@leaa/www/src/components';

import style from './style.module.less';

interface IProps {
  ax?: Ax;
}

export default (props: IProps) => {
  return (
    <div className={style['home-wrapper']}>
      <SwiperImage
        className={style['home-swiper']}
        lazy
        attachmentList={props.ax?.attachments?.galleryMbList}
        centerMode
        height={props.ax?.attachments?.galleryMbList[0]?.height}
      />
    </div>
  );
};
