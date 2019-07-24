import React from 'react';
import Swiper from 'react-id-swiper';
import Link from 'next/link';
import cx from 'classnames';

import { Attachment } from '@leaa/common/entrys';
import { RetinaImage } from '@leaa/www/components/RetinaImage';

import style from './style.less';

type UnionKeys<T> = T extends any ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

interface IBase {
  attachmentList: Attachment[];
  className?: string;
  lazy?: boolean;
}

interface INormalMode extends IBase {}

interface ICenterMode extends IBase {
  centerMode: boolean;
  height: number;
}

type IProps = StrictUnion<ICenterMode | INormalMode>;

export const SwiperImage = (props: IProps) => {
  const buildImgDom = (a: Attachment) => {
    if (props.lazy) {
      return (
        <>
          <RetinaImage attachment={a} lazy />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white" />
        </>
      );
    }

    return <RetinaImage attachment={a} />;
  };

  return (
    <div className={style['wrapper']}>
      {props.attachmentList.length > 0 && (
        <Swiper
          {...{
            autoplay: {
              delay: 5000,
            },
            keyboard: true,
            loop: true,
            speed: 400,
            lazy: props.lazy
              ? {
                  loadPrevNext: true,
                  // loadPrevNextAmount: 2,
                }
              : false,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          }}
        >
          {props.attachmentList.map(a => (
            <div
              key={a.uuid}
              className={cx(style['swiper-slide'], {
                [style['swiper-slide--center-model']]: props.centerMode,
              })}
              style={{ height: props.height }}
            >
              {a.link ? (
                <Link href={a.link}>
                  <a>{buildImgDom(a)}</a>
                </Link>
              ) : (
                buildImgDom(a)
              )}
            </div>
          ))}
        </Swiper>
      )}
    </div>
  );
};
