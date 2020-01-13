import React from 'react';
import { GraphQLError } from 'graphql';
import cx from 'classnames';
import Link from 'next/link';
import dayjs from 'dayjs';

import { GET_ARTICLES } from '@leaa/www/src/graphqls';
import { ArticlesWithPaginationObject } from '@leaa/common/src/dtos/article';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { IBasePageProps, IGetInitialPropsCtx } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

import style from './style.module.less';

interface IPageProps {
  articles?: ArticlesWithPaginationObject;
  articlesError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const nextPage = (props: IProps) => {
  const { articles, articlesError } = props.pageProps;

  if (articlesError) messageUtil.gqlError(articlesError?.message);
  if (!articles) return null;

  return (
    <PageCard>
      <HtmlMeta title="Article" keywords="article, list" />
      <div className={style['article-list-wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <HtmlMeta title="Article" />

          <div className={cx('g-container-card', style['container-card'])}>
            {articles?.items &&
              articles.items.map(item => (
                <div key={item.id} className={style['item']}>
                  <h2 className={style['title']}>
                    <Link href={`/article/${item.slug}`}>
                      <a className={style['link']}>{item.title}</a>
                    </Link>
                  </h2>
                  <div className={style['date']}>{dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialPropsCtx): Promise<IPageProps> => {
  try {
    const getArticlesQuery = await apolloClient.query<{ articles: ArticlesWithPaginationObject }>({
      query: GET_ARTICLES,
      variables: {
        page: 1,
        pageSize: 100,
        orderSort: 'DESC',
        orderBy: 'id',
      },
    });

    return { articles: getArticlesQuery?.data.articles };
  } catch (err) {
    return { articlesError: err };
  }
};

export default nextPage;
