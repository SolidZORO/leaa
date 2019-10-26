import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/src/graphqls';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/common/src/dtos/article';
import { ErrorCard } from '@leaa/www/src/components/ErrorCard';
import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { PageCard } from '@leaa/www/src/components/PageCard/PageCard';

const ArticleList = dynamic(() => import('@leaa/www/src/pages/article/_components/ArticleList/ArticleList'));

export default () => {
  const getArticlesVariables = {
    page: 1,
    pageSize: 100,
    orderSort: 'DESC',
    orderBy: 'id',
  };
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  const articles = getArticlesQuery && getArticlesQuery.data && getArticlesQuery.data.articles;

  return (
    <PageCard loading={getArticlesQuery.loading}>
      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

      {articles && (
        <>
          <HtmlMeta title="Article" keywords="article, list" />
          <ArticleList articles={articles} />
        </>
      )}
    </PageCard>
  );
};
