import React, { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import _ from 'lodash';

interface IProps {
  showAfterMs?: number;
}

export const ProgressLoading = (props: IProps) => {
  const nStart = _.debounce(NProgress.start, props.showAfterMs || 100);

  Router.events.on('routeChangeStart', nStart);

  Router.events.on('routeChangeComplete', () => {
    nStart.cancel();
    NProgress.done();
  });

  Router.events.on('routeChangeError', () => {
    nStart.cancel();
    NProgress.done();
  });

  return null;
};
