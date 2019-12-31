import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { Article } from '@leaa/common/src/entrys';
import { GET_ARTICLE_BY_SLUG } from '@leaa/www/src/graphqls';

import { IPageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

const ArticleItem = dynamic(() => import('./_components/ArticleItem/ArticleItem'));

interface IProps extends IPageProps {
  pageProps: {
    article?: Article;
    articleError?: GraphQLError;
  };
}

const nextPage = (ctx: IProps) => {
  const { article, articleError } = ctx.pageProps;

  if (articleError) messageUtil.gqlError(articleError?.message);
  if (!article) return null;

  return (
    <PageCard>
      <HtmlMeta
        title={article.title}
        description={article.description}
        keywords={article.tags?.map((tag: any) => tag.name).join(', ')}
      />
      <ArticleItem article={article} />
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  try {
    const getArticleQuery = await apolloClient.query<{ articleBySlug: Article }>({
      query: GET_ARTICLE_BY_SLUG,
      variables: {
        slug: ctx.query.slug,
      },
    });

    return { article: getArticleQuery.data.articleBySlug };
  } catch (e) {
    return { articleError: e };
  }
};

export default nextPage;
