import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { IPageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { ArticleArgs } from '@leaa/common/src/dtos/article';
import { GET_ARTICLE } from '@leaa/common/src/graphqls';
import { ErrorCard } from '@leaa/www/src/components/ErrorCard';
import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { PageCard } from '@leaa/www/src/components/PageCard';

const ArticleItem = dynamic(() => import('@leaa/www/src/pages/article/_components/ArticleItem/ArticleItem'));

const nextPage = ({ pageProps }: IPageProps) => {
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(pageProps.id) },
  });

  const article = getArticleQuery && getArticleQuery.data && getArticleQuery.data.article;

  return (
    <PageCard loading={getArticleQuery.loading}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

      {article && (
        <>
          <HtmlMeta
            title={article.title}
            description={article.description}
            keywords={article.tags && article.tags.map(tag => tag.name).join(', ')}
          />
          <ArticleItem article={article} />
        </>
      )}
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  return { id: ctx.query.id };
};

export default nextPage;
