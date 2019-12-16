import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { GET_ARTICLES } from '@leaa/common/src/graphqls';
import { ArticlesWithPaginationObject } from '@leaa/common/src/dtos/article';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { IPageProps } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

const ArticleList = dynamic(() => import('./_components/ArticleList/ArticleList'));

interface IProps extends IPageProps {
  pageProps: {
    articles?: ArticlesWithPaginationObject;
    articlesError?: GraphQLError;
  };
}

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

nextPage.getInitialProps = async () => {
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
  } catch (e) {
    return { articlesError: e };
  }
};

export default nextPage;
