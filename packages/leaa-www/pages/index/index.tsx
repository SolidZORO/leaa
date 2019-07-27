import React from 'react';
import cx from 'classnames';
import Head from 'next/head';
import { useQuery } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/entrys';
import { AxArgs } from '@leaa/common/dtos/ax';
import { GET_AX_BY_SLUG } from '@leaa/common/graphqls';
import { SwiperImage } from '@leaa/www/components/SwiperImage';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';

import style from './style.less';
import { withTranslation } from '../../i18n';

const nPage = () => {
  // const getAxBySlugVariables = { slug: 'index-swiper' };
  const getAxBySlugVariables = { slug: 'mz-swiper' };
  const getAxBySlugQuery = useQuery<{ axBySlug: Ax }, AxArgs>(GET_AX_BY_SLUG, {
    variables: getAxBySlugVariables,
  });

  const bannerMbList =
    getAxBySlugQuery &&
    getAxBySlugQuery.data &&
    getAxBySlugQuery.data.axBySlug &&
    getAxBySlugQuery.data.axBySlug.attachments &&
    getAxBySlugQuery.data.axBySlug.attachments.bannerMbList;

  return (
    <>
      {getAxBySlugQuery.error ? <ErrorCard error={getAxBySlugQuery.error} /> : null}

      <Head>
        <title>Here Is Home</title>
      </Head>

      {bannerMbList && <SwiperImage lazy attachmentList={bannerMbList} centerMode height={680} />}
      <div className={cx('g-full-container', style['full-container'])} />
    </>
  );
};

nPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default withTranslation()(nPage);
