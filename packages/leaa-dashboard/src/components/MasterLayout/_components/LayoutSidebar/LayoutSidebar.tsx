import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { masterRoutes, flateMasterRoutes } from '@leaa/dashboard/src/routes/master.route';
import { authUtil, deviceUtil } from '@leaa/dashboard/src/utils';
import { Rcon } from '@leaa/dashboard/src/components';
import logo from '@leaa/dashboard/src/assets/images/logo/logo-white.svg';

import { ALLOW_PERMISSION, SIDERBAR_COLLAPSED_SL_KEY, CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';

import { SidebarTarget } from '../SidebarTarget/SidebarTarget';

import style from './style.module.less';

interface IProps extends RouteComponentProps {
  className?: string;
  collapsedHash?: number;
}

const getMenuName = (menu: IRouteItem) => {
  const { t } = useTranslation();

  if (menu.namei18n) {
    return t(`${menu.namei18n}`);
  }

  return menu.name;
};

const checkPermission = (permission: string) => {
  const { flatPermissions } = authUtil.getAuthInfo();

  // e.g. 'user.list | role.list' in (master.route.tsx)
  if (permission.includes('|')) {
    return permission
      .split('|')
      .map(p => p.trim())
      .some(k => flatPermissions.includes(k));
  }

  return flatPermissions.includes(permission);
};

// group
const makeFlatMenu = (menu: IRouteItem): React.ReactNode => {
  let dom = null;

  // Home
  if (menu.path === '/') {
    return null;
  }

  // hasParam
  if (menu.path.includes(':')) {
    return dom;
  }

  if (menu.isCreate) {
    return dom;
  }

  if (menu.isFn) {
    return dom;
  }

  if (checkPermission(menu.permission) || menu.permission === ALLOW_PERMISSION) {
    const currentMenuCreatePermission = `${menu.permission.split('.')[0]}.item-create`;

    dom = (
      <Menu.Item key={menu.path} className={`g-sidebar-menu-${menu.path}`}>
        <Link to={menu.path}>
          <span className={style['nav-text']}>
            {menu.icon && <Rcon type={menu.icon} />}
            <em className="menu-name">{getMenuName(menu)}</em>
          </span>
        </Link>

        {menu.canCreate &&
          (authUtil.getAuthInfo().flatPermissions.includes(currentMenuCreatePermission) ||
            menu.permission === ALLOW_PERMISSION) && (
            <Link to={`${menu.path}/create`} className={style['can-create-button']}>
              <Rcon type={CREATE_BUTTON_ICON} />
            </Link>
          )}
      </Menu.Item>
    );
  }

  return dom;
};

// group
const makeFlatMenus = (menus: IRouteItem[]): React.ReactNode => {
  return menus.map(menu => {
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
          {menu.children.map(subMenu => makeFlatMenu(subMenu))}
        </Menu.SubMenu>
      );
    }

    return makeFlatMenu(menu);
  });
};

export const LayoutSidebar = (props: IProps) => {
  const pathWithoutParams = props.match.path.replace(/(^.*)\/.*/, '$1') || props.match.path;
  const [selectedKeys, setSelectedKeys] = useState<string>(pathWithoutParams);

  const curremtSelectedKey = flateMasterRoutes.find(r => r.path === props.match.path);
  const uiOpenKeys = curremtSelectedKey ? curremtSelectedKey.groupName || '' : '';

  const collapsedLs = localStorage.getItem(SIDERBAR_COLLAPSED_SL_KEY);
  let collapsedInit = collapsedLs !== null && collapsedLs === 'true';

  if (deviceUtil.isMobile() && collapsedLs === null) {
    collapsedInit = true;
  }

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
          <img src={logo} alt="" width={40} />
        </Link>
      </div>

      {masterRoutes && (
        <Menu
          className={style['menu-wrapper']}
          defaultSelectedKeys={[selectedKeys]}
          defaultOpenKeys={[uiOpenKeys]}
          selectable
          mode="inline"
          theme="dark"
          onSelect={() => setSelectedKeys(pathWithoutParams)}
        >
          {makeFlatMenus(masterRoutes)}
        </Menu>
      )}

      <div className={cx(style['target-button-wrapper'], 'target-button-wrapper')}>
        <SidebarTarget onCallbackSidebarTarget={() => onCollapse(collapsed, 'clickTrigger')} collapsed={collapsed} />
      </div>
    </Layout.Sider>
  );
};
