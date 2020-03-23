import React, { useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import Headroom from 'react-headroom';
import { Button, Drawer } from 'antd';

import { Rcon } from '@leaa/www/src/components';

import { __MENU_MOCK__ } from '@leaa/www/src/__mock__';

import style from './style.module.less';

export const LayoutHeader = () => {
  const headerMenu = [{ title: 'Home', link: '/' }].concat(__MENU_MOCK__.headerMenu);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const onSetVisible = (value: boolean) => {
    setDrawerVisible(value);
  };

  const menuListDom = (
    <ul className={style['menu-list']}>
      {headerMenu.map((m) => (
        <li key={m.title} className={style['menu-item']}>
          <Link href={m.link} prefetch={false}>
            <a className={style['link']} onClick={() => onSetVisible(false)}>
              {m.title}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );

  const authButtonDom = (
    <Button type="link" className={style['account-button']}>
      <Link href="/account">
        <a onClick={() => onSetVisible(false)}>
          <Rcon type="x-user" />
        </a>
      </Link>
    </Button>
  );

  return (
    <div className={style['full-layout-header']}>
      <Headroom className={style['full-headroom']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={style['logo-image']}>
            <Link href="/" prefetch={false}>
              <a onClick={() => onSetVisible(false)}>
                <img src="/static/images/logo/logo-black.svg" alt="" />
              </a>
            </Link>
          </div>

          <div className={style['menu-wrapper--pc']}>
            {menuListDom}
            {authButtonDom}
          </div>

          <div className={style['menu-wrapper--mb']}>
            <div
              className={cx(style['menu-mb-button-wrapper'], {
                [style['menu-mb-button-wrapper--action']]: drawerVisible,
              })}
            >
              <Button type="link" onClick={() => onSetVisible(!drawerVisible)} className={style['menu-mb-button']}>
                <div className={cx(style['menu-mb-button-line'], style['menu-mb-button-line--top'])} />
                <div className={cx(style['menu-mb-button-line'], style['menu-mb-button-line--bottom'])} />
              </Button>
            </div>

            <div className={style['account-mb-button-wrapper']}>{authButtonDom}</div>

            <div className={style['menu-mb-drawer-wrapper']}>
              <Drawer
                placement="top"
                visible={drawerVisible}
                closable={false}
                maskStyle={{ opacity: 0, backgroundColor: 'transparent' }}
                zIndex={998}
                onClose={() => onSetVisible(!drawerVisible)}
                className={cx(style['menu-mb-drawer'], {
                  [style['menu-mb-drawer--action']]: drawerVisible,
                })}
              >
                {menuListDom}
              </Drawer>
            </div>
          </div>
        </div>
      </Headroom>
    </div>
  );
};
