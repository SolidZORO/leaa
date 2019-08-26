import React from 'react';
import { IGetInitialProps } from '@leaa/www/interfaces';
import { urlUtil, authUtil } from '@leaa/www/utils';

const LOGOUTED_REDIRECT_TO_URL = '/';

const nextPage = () => {
  authUtil.removeAuth();
  urlUtil.redirect(LOGOUTED_REDIRECT_TO_URL);

  return null;
};

nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  authUtil.removeAuth(ctx);
  urlUtil.redirect(LOGOUTED_REDIRECT_TO_URL, ctx.res);

  return {};
};

export default nextPage;
