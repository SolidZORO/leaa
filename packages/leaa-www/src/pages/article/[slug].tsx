import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { IPageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { ArticleArgs } from '@leaa/common/src/dtos/article';
import { GET_ARTICLE_BY_SLUG } from '@leaa/common/src/graphqls';
import { HtmlMeta, PageCard, ErrorCard } from '@leaa/www/src/components';

const ArticleItem = dynamic(() => import('@leaa/www/src/pages/article/_components/ArticleItem/ArticleItem'));

interface IProps extends IPageProps {
  pageProps: {
    slug: string;
  };
}

const nextPage = ({ pageProps }: IProps) => {
  const getArticleQuery = useQuery<{ articleBySlug: Article }, ArticleArgs>(GET_ARTICLE_BY_SLUG, {
    variables: {
      slug: pageProps.slug,
    },
  });

  const article = getArticleQuery && getArticleQuery.data && getArticleQuery.data.articleBySlug;

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
  return ctx.query;
};

export default nextPage;
