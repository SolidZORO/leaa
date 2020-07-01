import _ from 'lodash';
import cx from 'classnames';
import i18n from 'i18next';
import React, { useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useMedia, useUpdateEffect } from 'react-use';
import { RiAddLine } from 'react-icons/ri';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { masterRouteList, flateMasterRoutes } from '@leaa/dashboard/src/routes/master.route';
import { getAuthInfo } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { ALLOW_PERMISSION, IS_MOBILE_SCREEN } from '@leaa/dashboard/src/constants';
import { SwitchLanguage } from '@leaa/dashboard/src/components';
import { UserMenu } from '@leaa/dashboard/src/layouts/MasterLayout/_components/UserMenu/UserMenu';

import { SidemenuTarget } from '../SidemenuTarget/SidemenuTarget';

import style from './style.module.less';

interface IProps extends RouteComponentProps {
  className?: string;
  collapsedHash?: number;
}

const LOGO = `${envConfig.ROUTER_BASENAME}/assets/images/logo/${
  envConfig.LOGO_BLACK_FILENAME || 'default-logo-black.svg'
}`;

export const LayoutSidebar = (props: IProps) => {
  const isMobile = useMedia(IS_MOBILE_SCREEN);

  const getPathname = () => props.location?.pathname.replace(/(^.*)\/.*/, '$1') || props.location?.pathname;
  const [selectedKey, setSelectedKey] = useState<string>(getPathname());
  const [drawer, setDrawer] = useState<boolean>(false);

  const openKey = flateMasterRoutes.find((r) => r.path === selectedKey)?.groupName || '';

  useUpdateEffect(() => {
    if (isMobile) setDrawer(false);
  }, [props.history.location.key]);

  const menuBaseDom = (
    <Layout.Sider collapsible collapsedWidth={0} trigger={null} className={style['full-layout-sidebar']}>
      <div className={cx(style['switch-language'], 'g-switch-language')}>
        <SwitchLanguage placement="topLeft" />
      </div>

      <div className={style['logo-wrapper']}>
        <Link to="/">
          <img src={LOGO} alt="" className={style['logo-image']} />
        </Link>
      </div>

      <Menu
        className={style['menu-wrapper']}
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={[openKey]}
        selectable
        mode="inline"
        theme="light"
      >
        {makeFlatMenus(masterRouteList)}
      </Menu>

      <div className={cx(style['user-menu'], 'g-user-menu')}>
        <UserMenu {...props} />
      </div>
    </Layout.Sider>
  );

  //
  //
  //
  //

  // MB
  const menuMbDom = (
    <>
      <Drawer
        className={style['drawer-wrapper']}
        placement="left"
        mask
        maskClosable
        // closable
        onClose={() => setDrawer(false)}
        visible={drawer}
        getContainer={false}
      >
        {menuBaseDom}
      </Drawer>
    </>
  );

  // PC
  const menuPcDom = <>{menuBaseDom}</>;

  const onCallbackSidebarTarget = () => (isMobile ? setDrawer(true) : undefined);

  return (
    <div className={cx(style['full-layout-sidebar-wrapper'], 'g-full-layout-sidebar-wrapper')}>
      <div className={cx(style['target-button-wrapper'], 'target-button-wrapper')}>
        <SidemenuTarget onCallbackSidebarTarget={onCallbackSidebarTarget} />
      </div>

      {isMobile ? menuMbDom : menuPcDom}
    </div>
  );
};

//
//
//
//
// fn

function getMenuName(menu: IRouteItem) {
  if (menu.namei18n) return i18n.t(`${menu.namei18n}`);

  return menu.name;
}

function checkPermission(permission: string) {
  const { flatPermissions } = getAuthInfo();

  // e.g. 'user.list | role.list' in (master.route.tsx)
  if (permission.includes('|'))
    return permission
      .split('|')
      .map((p) => p.trim())
      .some((k) => flatPermissions.includes(k));

  return flatPermissions.includes(permission);
}

// Menu Item
function makeFlatMenu(menu: IRouteItem): React.ReactNode {
  let flatMenuDom = null;

  // Home (hidden)
  if (menu.path === '/') return null;

  // hasParam (hidden)
  if (menu.path.includes(':') || menu.isCreate || menu.isFn) return flatMenuDom;

  if (checkPermission(menu.permission) || menu.permission === ALLOW_PERMISSION) {
    const currentMenuCreatePermission = `${menu.permission.split('.')[0]}.item-create`;

    flatMenuDom = (
      <Menu.Item key={menu.path} className={cx(style['sidebar-menu-item'], `g-sidebar-menu-item-${menu.path}`)}>
        <Link to={menu.path}>
          {menu.icon && <i>{menu.icon}</i>}
          <em>{getMenuName(menu)}</em>
        </Link>

        {menu.canCreate &&
          (getAuthInfo().flatPermissions.includes(currentMenuCreatePermission) ||
            menu.permission === ALLOW_PERMISSION) && (
            <Link to={`${menu.path}/create`} className={style['can-create-button']}>
              <RiAddLine />
            </Link>
          )}
      </Menu.Item>
    );
  }

  return flatMenuDom;
}

// Menu List
function makeFlatMenus(menus?: IRouteItem[]): React.ReactNode {
  if (_.isEmpty(menus)) return null;

  return menus?.map((menu) => {
    if (menu.children && (checkPermission(menu.permission) || menu.permission === ALLOW_PERMISSION)) {
      return (
        <Menu.SubMenu
          className={cx(style['sidebar-menu-item-group'], `g-sidebar-menu-item-group-${menu.path}`)}
          key={menu.path}
          title={
            <>
              <i>{menu.icon}</i>
              <em>{getMenuName(menu)}</em>
            </>
          }
        >
          {menu.children.map((subMenu) => makeFlatMenu(subMenu))}
        </Menu.SubMenu>
      );
    }

    return makeFlatMenu(menu);
  });
}
