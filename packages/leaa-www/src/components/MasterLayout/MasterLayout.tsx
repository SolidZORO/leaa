import React from 'react';
import cx from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import { Layout, message, Spin, Icon } from 'antd';

import { urlUtil } from '@leaa/www/src/utils';
import { IPageProps } from '@leaa/www/src/interfaces';
import { envConfig } from '@leaa/www/src/configs';
import { SettingsWithPaginationObject, SettingArgs } from '@leaa/common/src/dtos/setting';
import { GET_SETTINGS_FOR_WWW } from '@leaa/common/src/graphqls';
import { useStore } from '@leaa/www/src/stores';
import { ProgressLoading } from '@leaa/www/src/components/ProgressLoading';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';
import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSimpleFooter } from './_components/LayoutSimpleFooter/LayoutSimpleFooter';

import '@leaa/www/src/styles/global.less';
import style from './style.module.less';

Spin.setDefaultIndicator(<Icon type="loading" spin style={{ fontSize: '200%' }} />);

interface IProps extends IPageProps {
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

  const store = useStore();

  const getSettings = (): void => {
    const getSettingsQuery = useQuery<{ settings: SettingsWithPaginationObject }, SettingArgs>(GET_SETTINGS_FOR_WWW);

    if (getSettingsQuery.error) {
      message.error(getSettingsQuery.error);
    }

    store.setting.globalSettings =
      getSettingsQuery &&
      getSettingsQuery.data &&
      getSettingsQuery.data.settings &&
      getSettingsQuery.data.settings.items
        ? getSettingsQuery.data.settings.items
        : [];
  };

  // just once query setting
  getSettings();

  return (
    <div
      className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', `g-full-layout-wrapper--${pageClassName}`)}
    >
      <ProgressLoading showAfterMs={120} />
      <Layout className={style['full-layout-inner']} hasSider>
        <Layout>
          {!props.disableHeader && <LayoutHeader />}
          <LayoutContent>{props.children}</LayoutContent>
          {!props.disableFooter && <LayoutSimpleFooter />}
        </Layout>
      </Layout>

      {envConfig.NODE_ENV === 'production' && (
        <style
          id="transition-without-ssr"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: ' *, *::before, *::after { transition: none!important; }' }}
        />
      )}
    </div>
  );
};
