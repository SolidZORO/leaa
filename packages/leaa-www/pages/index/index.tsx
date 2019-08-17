import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/entrys';
import { AxArgs } from '@leaa/common/dtos/ax';
import { GET_AX_BY_SLUG } from '@leaa/common/graphqls';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { ErrorCard } from '@leaa/www/components/ErrorCard';

const Home = dynamic(() => import('@leaa/www/pages/index/_components/Home/Home'));

export default () => {
  const getAxBySlugVariables = { slug: 'index-swiper' };
  const getAxBySlugQuery = useQuery<{ axBySlug: Ax }, AxArgs>(GET_AX_BY_SLUG, {
    variables: getAxBySlugVariables,
  });

  return (
    <>
      {getAxBySlugQuery.error ? <ErrorCard error={getAxBySlugQuery.error} /> : null}

      {getAxBySlugQuery.data && getAxBySlugQuery.data.axBySlug && (
        <>
          <HtmlMeta title="Home" />
          <Home ax={getAxBySlugQuery.data.axBySlug} />
        </>
      )}
    </>
  );
};
