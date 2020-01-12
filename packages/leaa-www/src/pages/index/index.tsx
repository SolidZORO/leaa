import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { GET_AX_BY_SLUG } from '@leaa/www/src/graphqls';
import { Ax } from '@leaa/common/src/entrys';
import { AxArgs } from '@leaa/common/src/dtos/ax';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';

import { IBasePageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

const Home = dynamic(() => import('./_components/Home/Home'));

interface IPageProps {
  ax?: Ax;
  axError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

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

nextPage.getInitialProps = async (ctx: IGetInitialProps): Promise<IPageProps> => {
  try {
    const getAxBySlugQuery = await apolloClient.query<{ axBySlug: Ax }, AxArgs>({
      query: GET_AX_BY_SLUG,
      variables: { slug: 'index-swiper', orderBy: 'sort' },
      // fetchPolicy: 'network-only',
    });

    return { ax: getAxBySlugQuery?.data?.axBySlug };
  } catch (err) {
    return { axError: err };
  }
};

export default nextPage;
