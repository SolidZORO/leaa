import React from 'react';
import { IGetInitialProps } from '@leaa/www/interfaces';
import { urlUtil, authUtil } from '@leaa/www/utils';

const LOGOUTED_REDIRECT_TO_URL = '/';

const nextPage = () => {
  authUtil.removeAuth();
  urlUtil.redirect(LOGOUTED_REDIRECT_TO_URL);

  return null;
};

nextPage.getInitialProps = async ({ res }: IGetInitialProps) => {
  authUtil.removeAuth(res);
  urlUtil.redirect(LOGOUTED_REDIRECT_TO_URL, res);

  return {};
};

export default nextPage;
