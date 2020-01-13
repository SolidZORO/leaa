import cx from 'classnames';
import React from 'react';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';

import style from './style.module.less';

export default () => {
  return (
    <PageCard>
      <HtmlMeta title="Forget" />

      <div className={style['forget-wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>NO-FORGET-NOW</div>
      </div>
    </PageCard>
  );
};
