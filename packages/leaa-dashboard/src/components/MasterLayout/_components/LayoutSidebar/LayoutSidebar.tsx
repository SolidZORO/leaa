import React, { useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';

import logo from '@leaa/dashboard/assets/images/logo/logo-white.svg';
import { IRouteItem } from '@leaa/dashboard/interfaces';
import { masterRoutes } from '@leaa/dashboard/routes/master.route';

import style from './style.less';

interface IProps extends RouteComponentProps {}

const makeFlatMenu = (menu: IRouteItem): React.ReactNode => {
  let dom = null;

  if (menu.hasParam) {
    return dom;
  }

  if (menu.isCreate) {
    return dom;
  }

  dom = (
    <Menu.Item key={menu.path} className={`g-sidebar-menu-${menu.path}`}>
      <Link to={menu.path}>
        <span className="nav-text">
          {menu.icon && <Icon type={menu.icon} />}
          {menu.name}
        </span>
      </Link>

      {menu.canCreate && (
        <Link to={`${menu.path}/create`} className={style['can-create-button']}>
          <Icon type="plus" />
        </Link>
      )}
    </Menu.Item>
  );

  return dom;
};

//
const makeFlatMenus = (menus: IRouteItem[]): React.ReactNode =>
  menus.map(menu =>
    menu.children ? (
      <Menu.SubMenu
        className={`g-sidebar-group-menu-${menu.path}`}
        key={menu.path}
        title={
          <span className="nav-text">
            {menu.icon && <Icon type={menu.icon} />}
            {menu.name}
          </span>
        }
      >
        {menu.children.map(subMenu => makeFlatMenu(subMenu))}
      </Menu.SubMenu>
    ) : (
      makeFlatMenu(menu)
    ),
  );

export const LayoutSidebar = (props: IProps) => {
  // let uiSelectedKeys = '';
  const uiOpenKeys = '';
  const pathWithoutParams = props.match.path.replace(/(^.*)\/.*/, '$1') || props.match.path;

  console.log(props.match);

  const [selectedKeys, setSelectedKeys] = useState<string>(pathWithoutParams);

  return (
    <Layout.Sider collapsible={false} className={style['full-layout-sidebar']}>
      <div className={style['logo']}>
        <Link to="/">
          <img src={logo} alt="" width={40} />
        </Link>
      </div>

      {masterRoutes && (
        <Menu
          className={style['menu']}
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
    </Layout.Sider>
  );
};
