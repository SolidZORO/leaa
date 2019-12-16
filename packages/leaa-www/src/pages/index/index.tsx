import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { GET_AX_BY_SLUG } from '@leaa/common/src/graphqls';
import { Ax } from '@leaa/common/src/entrys';
import { AxArgs } from '@leaa/common/src/dtos/ax';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';

import { IPageProps } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

const Home = dynamic(() => import('./_components/Home/Home'));

interface IProps extends IPageProps {
  pageProps: {
    ax?: Ax;
    axError?: GraphQLError;
  };
}

const nextPage = (ctx: IProps) => {
  const { ax, axError } = ctx.pageProps;

  if (axError) messageUtil.gqlError(axError?.message);
  if (!ax) return null;

  return (
    <PageCard>
      <HtmlMeta title="Leaa" disableSiteName />
      <Home ax={ax} />
    </PageCard>
  );
};

nextPage.getInitialProps = async () => {
  try {
    const getAxBySlugQuery = await apolloClient.query<{ axBySlug: Ax }, AxArgs>({
      query: GET_AX_BY_SLUG,
      variables: { slug: 'index-swiper' },
    });

    return { ax: getAxBySlugQuery?.data.axBySlug };
  } catch (e) {
    return { axError: e };
  }
};

export default nextPage;
