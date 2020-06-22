import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import i18n from 'i18next';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { masterRouteList, flateMasterRoutes } from '@leaa/dashboard/src/routes/master.route';
import { getAuthInfo, isMobile } from '@leaa/dashboard/src/utils';
import { Rcon } from '@leaa/dashboard/src/components';
import { envConfig } from '@leaa/dashboard/src/configs';
import { ALLOW_PERMISSION, SIDERBAR_COLLAPSED_SL_KEY, CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';

import { SidebarTarget } from '../SidebarTarget/SidebarTarget';

import style from './style.module.less';

interface IProps extends RouteComponentProps {
  className?: string;
  collapsedHash?: number;
}

const LOGO_WHITE = `/assets/images/logo/${envConfig.LOGO_WHITE_FILENAME || 'default-logo-white.svg'}`;

export const LayoutSidebar = (props: IProps) => {
  const getPathname = () => props.location?.pathname.replace(/(^.*)\/.*/, '$1') || props.location?.pathname;
  const [selectedKey, setSelectedKey] = useState<string>(getPathname());

  const openKey = flateMasterRoutes.find((r) => r.path === selectedKey)?.groupName || '';

  const collapsedByLS = localStorage.getItem(SIDERBAR_COLLAPSED_SL_KEY);
  let collapsedInit = collapsedByLS !== null && collapsedByLS === 'true';

  if (isMobile() && collapsedByLS === null) collapsedInit = true;

  const [collapsed, setCollapsed] = useState<boolean>(collapsedInit);

  const onCollapse = (isCollapsed: boolean, type: 'responsive' | 'clickTrigger') => {
    if (type === 'clickTrigger') {
      const nextCollapsed = !collapsed;
      localStorage.setItem(SIDERBAR_COLLAPSED_SL_KEY, `${nextCollapsed}`);

      setCollapsed(nextCollapsed);
    }
  };

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('siderbar-collapsed');
    } else {
      document.body.classList.remove('siderbar-collapsed');
    }
  }, [collapsed]);

  return (
    <Layout.Sider
      collapsed={collapsed}
      defaultCollapsed={collapsed}
      collapsible
      collapsedWidth={0}
      className={style['full-layout-sidebar']}
      id="full-layout-sidebar"
      breakpoint="md"
      onCollapse={(isCollapsed, type) => onCollapse(isCollapsed, type)}
      trigger={null}
    >
      <div className={style['logo-wrapper']}>
        <Link to="/">
          <img src={LOGO_WHITE} alt="" className={style['logo-image']} />
        </Link>
      </div>

      {masterRouteList && (
        <Menu
          className={style['menu-wrapper']}
          defaultSelectedKeys={[selectedKey]}
          defaultOpenKeys={[openKey]}
          selectable
          mode="inline"
          theme="dark"
          onSelect={() => setSelectedKey(getPathname())}
        >
          {makeFlatMenus(masterRouteList)}
        </Menu>
      )}

      <div className={cx(style['target-button-wrapper'], 'target-button-wrapper')}>
        <SidebarTarget onCallbackSidebarTarget={() => onCollapse(collapsed, 'clickTrigger')} collapsed={collapsed} />
      </div>
    </Layout.Sider>
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

// Menu
function makeFlatMenu(menu: IRouteItem): React.ReactNode {
  let flatMenuDom = null;

  // Home (hidden)
  if (menu.path === '/') return null;

  // hasParam (hidden)
  if (menu.path.includes(':') || menu.isCreate || menu.isFn) return flatMenuDom;

  if (checkPermission(menu.permission) || menu.permission === ALLOW_PERMISSION) {
    const currentMenuCreatePermission = `${menu.permission.split('.')[0]}.item-create`;

    flatMenuDom = (
      <Menu.Item key={menu.path} className={`g-sidebar-menu-${menu.path}`}>
        <Link to={menu.path}>
          <span className={style['nav-text']}>
            {menu.icon && <Rcon type={menu.icon} />}
            <em className="menu-name">{getMenuName(menu)}</em>
          </span>
        </Link>

        {menu.canCreate &&
          (getAuthInfo().flatPermissions.includes(currentMenuCreatePermission) ||
            menu.permission === ALLOW_PERMISSION) && (
            <Link to={`${menu.path}/create`} className={style['can-create-button']}>
              <Rcon type={CREATE_BUTTON_ICON} />
            </Link>
          )}
      </Menu.Item>
    );
  }

  return flatMenuDom;
}

// SubMenu
function makeFlatMenus(menus: IRouteItem[]): React.ReactNode {
  return menus.map((menu) => {
    if (menu.children && (checkPermission(menu.permission) || menu.permission === ALLOW_PERMISSION)) {
      return (
        <Menu.SubMenu
          className={`g-sidebar-group-menu-${menu.path}`}
          key={menu.path}
          title={
            <span className={style['nav-text']}>
              {menu.icon && <Rcon type={menu.icon} />}
              <em className="menu-name">{getMenuName(menu)}</em>
            </span>
          }
        >
          {menu.children.map((subMenu) => makeFlatMenu(subMenu))}
        </Menu.SubMenu>
      );
    }

    return makeFlatMenu(menu);
  });
}
