import React from 'react';
import getConfig from 'next/config';
import Swiper from 'react-id-swiper';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { Button } from 'antd';

import { GET_AX_BY_SLUG } from '@leaa/common/graphqls';
import { Ax } from '@leaa/common/entrys';
import { AxArgs } from '@leaa/common/dtos/ax';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';

import style from './style.less';

export default () => {
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

      <Button type="primary" icon="user">
        BB
      </Button>

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
          <div key={a.uuid}>
            <Link href={`/${a.link}`}>
              <a>
                <img src={`${publicRuntimeConfig.API_HOST}${a.path}`} alt=""
                     className={style['image']}
                />
              </a>
            </Link>
          </div>
        ))}
      </Swiper>
    </div>
  );
};
