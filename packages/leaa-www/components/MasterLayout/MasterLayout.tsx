import React from 'react';
import cx from 'classnames';
import { Layout } from 'antd';

import { urlUtil } from '@leaa/www/utils';
import { IAppProps } from '@leaa/www/interfaces';
import { envConfig } from '@leaa/www/configs';
import { ProgressLoading } from '@leaa/www/components/ProgressLoading';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';
import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutFooter } from './_components/LayoutFooter/LayoutFooter';

import '@leaa/www/styles/global.less';
import style from './style.less';

interface IProps extends IAppProps {
  children: React.ReactNode;
  disableSidebar?: boolean;
  disableHeader?: boolean;
  disableFooter?: boolean;
}

export const MasterLayout = (props: IProps) => {
  const pageClassName =
    props && props.router.pathname ? `page-${urlUtil.routerPathToClassName(props.router.pathname)}` : null;

  if (typeof window !== 'undefined' && envConfig.NODE_ENV === 'production') {
    window.onload = () => {
      console.log('check transitionWithoutSSR');

      const transitionWithoutSSR = document.getElementById('transition-without-ssr');

      if (transitionWithoutSSR) {
        transitionWithoutSSR.remove();
      }
    };
  }

  return (
    <div
      className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', `g-full-layout-wrapper--${pageClassName}`)}
    >
      <ProgressLoading showAfterMs={800} />
      <Layout className={style['full-layout-inner']} hasSider>
        <Layout>
          {!props.disableHeader && <LayoutHeader />}
          <LayoutContent>{props.children}</LayoutContent>
          {!props.disableFooter && <LayoutFooter />}
        </Layout>
      </Layout>

      {envConfig.NODE_ENV === 'production' && (
        <style
          id="transition-without-ssr"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: ` *, *::before, *::after { transition: none!important; }` }}
        />
      )}
    </div>
  );
};
