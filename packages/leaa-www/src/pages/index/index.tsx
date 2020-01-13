import React from 'react';
import { GraphQLError } from 'graphql';

import { GET_AX_BY_SLUG } from '@leaa/www/src/graphqls';
import { Ax } from '@leaa/common/src/entrys';
import { AxArgs } from '@leaa/common/src/dtos/ax';
import { HtmlMeta, PageCard, SwiperImage } from '@leaa/www/src/components';

import { IBasePageProps, IGetInitialPropsCtx } from '@leaa/www/src/interfaces';
import { apolloClient } from '@leaa/www/src/libs';
import { messageUtil } from '@leaa/www/src/utils';

import style from './style.module.less';

interface IPageProps {
  ax?: Ax;
  axError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const nextPage = (ctx: IProps) => {
  const { ax, axError } = ctx.pageProps;

  if (axError) messageUtil.gqlError(axError?.message);

  return (
    <PageCard>
      <HtmlMeta title="Leaa" disableSiteName />
      <div className={style['home-wrapper']}>
        <SwiperImage
          className={style['home-swiper']}
          lazy
          attachmentList={ax?.attachments?.galleryMbList}
          centerMode
          height={ax?.attachments?.galleryMbList[0]?.height}
        />
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialPropsCtx): Promise<IPageProps> => {
  try {
    const getAxBySlugQuery = await apolloClient.query<{ axBySlug: Ax }, AxArgs>({
      query: GET_AX_BY_SLUG,
      variables: { slug: 'index-swiper', orderBy: 'sort' },
    });

    return { ax: getAxBySlugQuery?.data?.axBySlug };
  } catch (err) {
    return { axError: err };
  }
};

export default nextPage;
