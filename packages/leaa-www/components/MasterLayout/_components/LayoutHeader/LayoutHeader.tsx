import React, { useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { Button, Drawer } from 'antd';

import { __MENU_MOCK__ } from '@leaa/www/__mock__';

import style from './style.less';

interface IProps {}

export const LayoutHeader = (props: IProps) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const onSetVisible = (value?: boolean) => {
    if (typeof value !== 'undefined') {
      setDrawerVisible(value);

      return;
    }

    setDrawerVisible(!drawerVisible);
  };

  const menuListDom = (
    <ul className={style['menu-list']}>
      <li key="home" className={style['menu-item']}>
        <Link href="/">
          <a className={style['link']} onClick={() => onSetVisible(false)}>
            Home
          </a>
        </Link>
      </li>

      {__MENU_MOCK__.headerMenu.map(m => (
        <li key={m.title} className={style['menu-item']}>
          <Link href={m.link}>
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
      <Link href="/ram">
        <a className={style['link']} onClick={() => onSetVisible(false)}>
          Login
        </a>
      </Link>
      {' · '}
      <Link href="/ram">
        <a className={style['link']} onClick={() => onSetVisible(false)}>
          Register
        </a>
      </Link>
    </div>
  );

  return (
    <div className={style['full-layout-header']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={style['logo-image']}>
          <Link href="/">
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
          <div className={style['menu-mb-drawer-wrapper']}>
            <Button type="link" onClick={() => onSetVisible()} icon="menu" className={style['menu-mb-drawer-botton']} />
          </div>

          <Drawer
            placement="right"
            onClose={() => onSetVisible(false)}
            visible={drawerVisible}
            // visible={true}
            closable={false}
            className={style['menu-mb-drawe-box']}
          >
            <Button
              type="link"
              onClick={() => onSetVisible(false)}
              icon="close"
              className={style['menu-mb-drawer-close']}
            />

            {menuListDom}
            {authListDom}
          </Drawer>
        </div>
      </div>
    </div>
  );
};
