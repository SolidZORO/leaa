import React from 'react';
import getConfig from 'next/config';
import Swiper from 'react-id-swiper';
import { useQuery } from '@apollo/react-hooks';

import { GET_AX_BY_SLUG } from '@leaa/common/graphqls';
import { Ax } from '@leaa/common/entrys';
import { AxArgs } from '@leaa/common/dtos/ax';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';

import style from './style.less';
import Link from 'next/link';

export const BannerSwiper = () => {
  const { publicRuntimeConfig } = getConfig();

  const getAxBySlugVariables = { slug: 'index-swiper' };
  const getAxBySlugQuery = useQuery<{ axBySlug: Ax }, AxArgs>(GET_AX_BY_SLUG, {
    variables: getAxBySlugVariables,
  });

  const bannerMbList =
    (getAxBySlugQuery &&
      getAxBySlugQuery.data &&
      getAxBySlugQuery.data.axBySlug &&
      getAxBySlugQuery.data.axBySlug.attachments &&
      getAxBySlugQuery.data.axBySlug.attachments.bannerMbList) ||
    [];

  return (
    <div className={style['wrapper']}>
      {getAxBySlugQuery.error ? <ErrorCard error={getAxBySlugQuery.error} /> : null}

      <Swiper
        {...{
          autoplay: {
            delay: 5000,
          },
          keyboard: true,
          loop: true,
          autoHeight: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        }}
      >
        {bannerMbList.map(a => (
          <Link href={a.link}>
            <a className={style['link']}>
              <img key={a.uuid} src={`${publicRuntimeConfig.API_HOST}${a.path}`} alt="" />
            </a>
          </Link>
        ))}
      </Swiper>
    </div>
  );
};
