import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Article } from '@leaa/common/entrys';
import { IAppProps } from '@leaa/www/interfaces';
import { ArticleArgs } from '@leaa/common/dtos/article';
import { GET_ARTICLE } from '@leaa/common/graphqls';
import { ErrorCard } from '@leaa/www/components/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import ArticleItem from '@leaa/www/pages/article/_components/ArticleItem/ArticleItem';

export default ({ router }: IAppProps) => {
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(router.query.id) },
  });

  return (
    <>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

      {getArticleQuery && getArticleQuery.data && getArticleQuery.data.article && (
        <>
          <HtmlMeta title={getArticleQuery.data.article.title} description={getArticleQuery.data.article.description} />
          <ArticleItem article={getArticleQuery.data.article} />
        </>
      )}
    </>
  );
};
