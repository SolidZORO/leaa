import React from 'react';
import cx from 'classnames';
import { GraphQLError } from 'graphql';

import { Article } from '@leaa/common/src/entrys';
import { GET_ARTICLE_BY_SLUG } from '@leaa/www/src/graphqls';

import { IBasePageProps, IGetInitialProps } from '@leaa/www/src/interfaces';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

import style from './style.module.less';

interface IPageProps {
  article?: Article;
  articleError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const nextPage = (props: IProps) => {
  const { article, articleError } = props.pageProps;

  if (articleError) messageUtil.gqlError(articleError?.message);
  if (!article) return null;

  return (
    <PageCard>
      <HtmlMeta
        title={article.title}
        description={article.description}
        keywords={article.tags?.map((tag: any) => tag.name).join(', ')}
      />
      <div className={style['article-item-wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={cx('g-container-card', style['container-card'])}>
            <h1 className={style['title']}>{article.title}</h1>
            <div className={style['content']}>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
                className={style['typo']}
              />
            </div>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps): Promise<IPageProps> => {
  try {
    const getArticleQuery = await apolloClient.query<{ articleBySlug: Article }>({
      query: GET_ARTICLE_BY_SLUG,
      variables: {
        slug: ctx.query.slug,
      },
    });

    return { article: getArticleQuery.data.articleBySlug };
  } catch (err) {
    return { articleError: err };
  }
};

export default nextPage;
