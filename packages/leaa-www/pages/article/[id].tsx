import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { IPageProps, IGetInitialProps } from '@leaa/www/interfaces';
import { ArticleArgs } from '@leaa/common/src/dtos/article';
import { GET_ARTICLE } from '@leaa/common/src/graphqls';
import { ErrorCard } from '@leaa/www/components/ErrorCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { PageCard } from '@leaa/www/components/PageCard';

const ArticleItem = dynamic(() => import('@leaa/www/pages/article/_components/ArticleItem/ArticleItem'));

const nextPage = ({ pageProps }: IPageProps) => {
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(pageProps.id) },
  });

  return (
    <PageCard loading={getArticleQuery.loading}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

      {getArticleQuery && getArticleQuery.data && getArticleQuery.data.article && (
        <>
          <HtmlMeta title={getArticleQuery.data.article.title} description={getArticleQuery.data.article.description} />

          <ArticleItem article={getArticleQuery.data.article} />
        </>
      )}
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  return { id: ctx.query.id };
};

export default nextPage;
