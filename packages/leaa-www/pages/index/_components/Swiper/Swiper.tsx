import React from 'react';

import style from './style.less';
import { useQuery } from '@apollo/react-hooks';
import { GET_AX_BY_SLUG } from '@leaa/common/graphqls';
import { Ax } from '@leaa/common/entrys';
import { AxArgs } from '@leaa/common/dtos/ax';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';
import getConfig from 'next/config';

export const Swiper = () => {
  const { publicRuntimeConfig } = getConfig();
  const getAxBySlugVariables = { slug: 'index-swiper' };
  const getAxBySlugQuery = useQuery<{ axBySlug: Ax }, AxArgs>(GET_AX_BY_SLUG, {
    variables: getAxBySlugVariables,
  });

  return (
    <div className={style['wrapper']}>
      {getAxBySlugQuery.error ? <ErrorCard error={getAxBySlugQuery.error} /> : null}

      {getAxBySlugQuery.data &&
        getAxBySlugQuery.data.axBySlug.attachments &&
        getAxBySlugQuery.data.axBySlug.attachments.bannerMbList.map(a => (
          <p key={a.uuid}>
            <img width={100} src={`${publicRuntimeConfig.API_HOST}${a.path}`} alt="" />
          </p>
        ))}
    </div>
  );
};
