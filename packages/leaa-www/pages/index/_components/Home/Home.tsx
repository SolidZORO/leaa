import React from 'react';
import { SwiperImage } from '@leaa/www/components/SwiperImage';
import { Ax } from '@leaa/common/entrys';

import style from './style.less';

interface IProps {
  ax: Ax;
}

export const Home = (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      {props.ax && props.ax.attachments && props.ax.attachments.bannerMbList && (
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
