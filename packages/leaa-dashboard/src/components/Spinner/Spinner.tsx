import React, { useEffect } from 'react';
// @ts-ignore
import NProgress from 'nprogress';

import './nprogress.less';

export const Spinner = () => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
      // NProgress.remove();
    };
  }, []);

  return null;
  // return <Spin className={style['suspense-fallback-loader']} />;
};
