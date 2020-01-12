import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { GET_ARTICLES } from '@leaa/www/src/graphqls';
import { ArticlesWithPaginationObject } from '@leaa/common/src/dtos/article';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { IBasePageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

const ArticleList = dynamic(() => import('./_components/ArticleList/ArticleList'));

interface IPageProps {
  articles?: ArticlesWithPaginationObject;
  articlesError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const nextPage = (ctx: IProps) => {
  const { articles, articlesError } = ctx.pageProps;

  if (articlesError) messageUtil.gqlError(articlesError?.message);
  if (!articles) return null;

  return (
    <PageCard>
      <HtmlMeta title="Article" keywords="article, list" />
      <ArticleList articles={articles} />
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps): Promise<IPageProps> => {
  try {
    const getArticlesQuery = await apolloClient.query<{ articles: ArticlesWithPaginationObject }>({
      query: GET_ARTICLES,
      variables: {
        page: 1,
        pageSize: 100,
        orderSort: 'DESC',
        orderBy: 'id',
      },
    });

    return { articles: getArticlesQuery?.data.articles };
  } catch (err) {
    return { articlesError: err };
  }
};

export default nextPage;
