import cx from 'classnames';
import React from 'react';

import { HtmlMeta, PageCard } from '@leaa/www/src/components';

import style from './style.module.less';

interface IProps {}

export default (props: IProps) => {
  return (
    <div className={style['hello-list-wrapper']}>
      <PageCard>
        <HtmlMeta title="Hello List" />

        <div className={cx('g-full-container')}>
          <h1>Hello!</h1>
        </div>
      </PageCard>
    </div>
  );
};
