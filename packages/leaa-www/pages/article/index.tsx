import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/src/graphqls';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/common/src/dtos/article';
import { ErrorCard } from '@leaa/www/components/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { PageCard } from '../../components/PageCard/PageCard';

const ArticleList = dynamic(() => import('@leaa/www/pages/article/_components/ArticleList/ArticleList'));

export default () => {
  const getArticlesVariables = {};
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  return (
    <PageCard loading={getArticlesQuery.loading}>
      <HtmlMeta title="Article" />

      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}
      {getArticlesQuery.data && getArticlesQuery.data.articles && (
        <ArticleList articles={getArticlesQuery.data.articles} />
      )}
    </PageCard>
  );
};
