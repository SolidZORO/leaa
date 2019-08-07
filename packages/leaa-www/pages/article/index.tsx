import React from 'react';
import cx from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/common/dtos/article';
import { GET_ARTICLES } from '@leaa/common/graphqls';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta/HtmlMeta';

import style from './style.less';

export default () => {
  const getArticlesVariables = {};
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  return (
    <div className={cx('g-full-container', style['full-container'])}>
      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

      <HtmlMeta title="Articles" />

      {getArticlesQuery.data &&
        getArticlesQuery.data.articles &&
        getArticlesQuery.data.articles.items &&
        getArticlesQuery.data.articles.items.map(article => (
          <div key={article.id}>
            <Link href={`/article/${article.id}`}>
              <a>
                <h1>{article.title}</h1>
              </a>
            </Link>
            <p>{article.description}</p>
          </div>
        ))}
    </div>
  );
};
