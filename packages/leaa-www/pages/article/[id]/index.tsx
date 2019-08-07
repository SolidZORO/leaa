import React from 'react';
import cx from 'classnames';
import { useQuery } from '@apollo/react-hooks';

import { Article } from '@leaa/common/entrys';
import { IAppProps } from '@leaa/www/interfaces';
import { ArticleArgs } from '@leaa/common/dtos/article';
import { GET_ARTICLE } from '@leaa/common/graphqls';
import { ErrorCard } from '@leaa/www/components/ErrorCard/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

import style from './style.less';

export default ({ router }: IAppProps) => {
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(router.query.id) },
  });

  return (
    <div className={cx('g-full-container', style['full-container'])}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

      {getArticleQuery && getArticleQuery.data && getArticleQuery.data.article && (
        <>
          <HtmlMeta
            title={getArticleQuery.data.article.title}
            description={getArticleQuery.data.article.description}
          />

          <h2>{getArticleQuery.data.article.title}</h2>

          <div
            className="content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: getArticleQuery.data.article.content || '' }}
          />
        </>
      )}
    </div>
  );
};
