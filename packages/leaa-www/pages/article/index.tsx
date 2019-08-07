import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/graphqls';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/common/dtos/article';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta/HtmlMeta';
import { ArticleList } from '@leaa/www/pages/article/_components/ArticleList/ArticleList';

export default () => {
  const getArticlesVariables = {};
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  return (
    <>
      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

      {getArticlesQuery.data && getArticlesQuery.data.articles && (
        <>
          <HtmlMeta title="Articles" />
          <ArticleList articles={getArticlesQuery.data.articles} />
        </>
      )}
    </>
  );
};
