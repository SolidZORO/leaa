import React from 'react';
import Swiper from 'react-id-swiper';
import Link from 'next/link';

import { Attachment } from '@leaa/common/entrys';
import { RetinaImage } from '@leaa/www/components/RetinaImage';

import style from './style.less';

interface IProps {
  attachmentList: Attachment[];
  className?: string;
}

export const ImageSwiper = (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <Swiper
        {...{
          autoplay: {
            delay: 5000,
          },
          keyboard: true,
          loop: true,
          speed: 400,
          lazy: true,
          autoHeight: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        }}
      >
        {props.attachmentList.map(a => (
          <div key={a.uuid} className={style['swiper-item']}>
            {a.link ? (
              <Link href={`/${a.link}`}>
                <a>
                  <RetinaImage attachment={a} />
                </a>
              </Link>
            ) : (
              <RetinaImage attachment={a} />
            )}
          </div>
        ))}
      </Swiper>
    </div>
  );
};
