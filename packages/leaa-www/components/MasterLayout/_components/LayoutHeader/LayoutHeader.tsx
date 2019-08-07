import React, { useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import Headroom from 'react-headroom';
import { Button, Drawer } from 'antd';

import { __MENU_MOCK__ } from '@leaa/www/__mock__';

import style from './style.less';

export const LayoutHeader = () => {
  const headerMenu = [{ title: 'Home', link: '/' }].concat(__MENU_MOCK__.headerMenu);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const onSetVisible = (value: boolean) => {
    setDrawerVisible(value);
  };

  const menuListDom = (
    <ul className={style['menu-list']}>
      {headerMenu.map(m => (
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

  const authListDom = (
    <div className={style['auth-list']}>
      <Link href="/ram" prefetch={false}>
        <a className={style['link']} onClick={() => onSetVisible(false)}>
          Login
        </a>
      </Link>
      <span> · </span>
      <Link href="/ram" prefetch={false}>
        <a className={style['link']} onClick={() => onSetVisible(false)}>
          Register
        </a>
      </Link>
    </div>
  );

  return (
    <div className={style['full-layout-header']}>
      <Headroom className={style['full-headroom']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={style['logo-image']}>
            <Link href="/" prefetch={false}>
              <a>
                <img src="/static/images/logo/logo-black.svg" alt="" />
              </a>
            </Link>
          </div>

          <div className={style['menu-wrapper--pc']}>
            {menuListDom}
            {authListDom}
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

            <div className={style['menu-mb-drawer-wrapper']}>
              <Drawer
                placement="top"
                visible={drawerVisible}
                closable={false}
                maskStyle={{ opacity: 0 }}
                zIndex={998}
                onClose={() => onSetVisible(!drawerVisible)}
                height="100%"
                className={cx(style['menu-mb-drawer'], {
                  [style['menu-mb-drawer--action']]: drawerVisible,
                })}
              >
                {menuListDom}
                {authListDom}
              </Drawer>
            </div>
          </div>
        </div>
      </Headroom>
    </div>
  );
};
