import cx from 'classnames';
import React from 'react';

import queryString from 'query-string';

import { HtmlMeta, PageCard } from '@leaa/www/src/components';
import { IBasePageProps } from '@leaa/www/src/interfaces';

import style from './style.module.less';

interface IPageProps {}
interface IProps extends IBasePageProps<IPageProps> {}
interface IUrlQuery {
  query: { token?: string };
}

export default (props: IProps) => {
  const qs: IUrlQuery = queryString.parseUrl(props.router.asPath);

  return (
    <div className={style['hello-wrapper']}>
      <PageCard>
        <HtmlMeta title={`Hello ${props.router.query?.name}`} />

        <div className={cx('g-full-container')}>
          <h1>Hello!</h1>
          <br />
          <h2>name: {props.router.query?.name}</h2>
          <h2>token: {qs.query?.token}</h2>
        </div>
      </PageCard>
    </div>
  );
};
