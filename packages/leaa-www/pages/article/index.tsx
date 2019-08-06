import React from 'react';
import cx from 'classnames';
import Head from 'next/head';
import { useQuery } from '@apollo/react-hooks';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/common/dtos/article';
import { GET_ARTICLES } from '@leaa/common/graphqls';
import { seoUtil } from '@leaa/www/utils';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';

import style from './style.less';

export default () => {
  const getArticlesVariables = {};
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  return (
    <>
      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

      <Head>
        <title>{seoUtil.titleWichSiteName('Articles')}</title>
      </Head>

      <div className={cx('g-full-container', style['full-container'])}>
        {getArticlesQuery.data &&
          getArticlesQuery.data.articles &&
          getArticlesQuery.data.articles.items &&
          getArticlesQuery.data.articles.items.map(article => (
            <div key={article.id}>
              <h1>{article.title}</h1>
              <p>{article.description}</p>
            </div>
          ))}
      </div>
    </>
  );
};
