import React from 'react';
import { observable } from 'mobx';
import { Layout, Menu, Icon } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';

import { IRouteMenu } from '@leaa/dashboard/interfaces';
import { masterRouteMenus } from '@leaa/dashboard/routes/master.route';

import style from './style.less';

interface IProps extends RouteComponentProps {}

const makeFlatMenu = (menu: IRouteMenu): React.ReactNode => {
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
const makeFlatMenus = (menus: IRouteMenu[]): React.ReactNode =>
  menus.map(menu =>
    menu.children ? (
      <Menu.SubMenu
        className={`g-sidebar-submenu-${menu.path}`}
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

// @inject('store')
export class LayoutSidebar extends React.Component<IProps> {
  @observable private uiUrlForSelect = '';
  @observable private uiUrlForOpen = '';

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    // const store: IStore = this.props.store!;
    // const { router } = this.props;
    //
    // if (router && router.asPath) {
    //   // onRemove query
    //
    //   const urlPath = router.asPath.replace(/(.*?)\?.*/, '$1');
    //
    //   this.uiUrlForSelect = urlPath;
    //   // if (urlPath.replace === ''), SET asPath
    //   this.uiUrlForOpen = (urlPath.replace(/(^.*)\/.*/, '$1') || urlPath).replace(/\/item/, ''); // e.g. /news/item --> /news
    // }

    return (
      <Layout.Sider collapsible={false} className={style['full-layout-sidebar']}>
        <div className={style.logo}>
          <Link to="/">
            <img src="" alt="" width={40} />
          </Link>
        </div>

        {masterRouteMenus && (
          <Menu
            className={style.menu}
            defaultSelectedKeys={[this.uiUrlForOpen]}
            defaultOpenKeys={[this.uiUrlForOpen]}
            selectable
            mode="inline"
            theme="dark"
          >
            {makeFlatMenus(masterRouteMenus)}
          </Menu>
        )}
      </Layout.Sider>
    );
  }
}
