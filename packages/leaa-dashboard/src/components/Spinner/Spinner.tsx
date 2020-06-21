import React from 'react';
import _ from 'lodash';
// @ts-ignore
import NProgress from 'nprogress';
// import { Spin } from 'antd';

export const Spinner = () => {
  React.useEffect(() => {
    const nStart = _.debounce(NProgress.start, 100);
    nStart();

    return () => {
      nStart.cancel();
      NProgress.done();
    };
  }, []);

  return null;
  // return <Spin className={style['suspense-fallback-loader']} />;
};
