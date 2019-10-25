import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/src/entrys';
import { AxArgs } from '@leaa/common/src/dtos/ax';
import { GET_AX_BY_SLUG } from '@leaa/common/src/graphqls';
import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { PageCard } from '@leaa/www/src/components/PageCard';
import { ErrorCard } from '@leaa/www/src/components/ErrorCard';

const Home = dynamic(() => import('@leaa/www/src/pages/index/_components/Home/Home'));

export default () => {
  const getAxBySlugVariables = { slug: 'index-swiper' };
  const getAxBySlugQuery = useQuery<{ axBySlug: Ax }, AxArgs>(GET_AX_BY_SLUG, {
    variables: getAxBySlugVariables,
  });

  return (
    <PageCard loading={getAxBySlugQuery.loading}>
      <HtmlMeta title="Leaa" disableSiteName />

      {getAxBySlugQuery.error ? <ErrorCard error={getAxBySlugQuery.error} /> : null}
      {getAxBySlugQuery.data && getAxBySlugQuery.data.axBySlug && <Home ax={getAxBySlugQuery.data.axBySlug} />}
    </PageCard>
  );
};
