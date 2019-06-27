import React from 'react';
import { inject } from 'mobx-react';
import { observable } from 'mobx';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

import { IMenuItem } from '@leaa/dashboard/configs/menu.config';
import { RootStore } from '@leaa/dashboard/stores';
import style from './style.less';

interface IProps {
  store?: RootStore;
}

const makeFlatMenuItem = (menu: IMenuItem) => {
  let itemDom = null;

  if (menu.hasParam) {
    return itemDom;
  }

  if (menu.isCreate) {
    return itemDom;
  }

  itemDom = (
    <Menu.Item key={menu.pattern} className={`g-sidebar-menu-${menu.pattern}`}>
      <Link to={menu.pattern}>
        <span className="nav-text">
          {menu.icon && <Icon type={menu.icon} />}
          {menu.name}
        </span>
      </Link>

      {menu.canCreate && (
        <Link to={`${menu.pattern}/create`} className={style['can-create-button']}>
          <Icon type="plus" />
        </Link>
      )}
    </Menu.Item>
  );

  return itemDom;
};

const makeFlatMenuList = (menus: IMenuItem[]) =>
  menus.map(menu =>
    menu.children ? (
      <Menu.SubMenu
        className={`g-sidebar-submenu-${menu.pattern}`}
        key={menu.pattern}
        title={
          <span className="nav-text">
            {menu.icon && <Icon type={menu.icon} />}
            {menu.name}
          </span>
        }
      >
        {menu.children.map(subMenu => makeFlatMenuItem(subMenu))}
      </Menu.SubMenu>
    ) : (
      makeFlatMenuItem(menu)
    ),
  );

@inject('store')
export class LayoutSidebar extends React.Component<IProps> {
  @observable private uiUrlForSelect = '';
  @observable private uiUrlForOpen = '';

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const store: RootStore = this.props.store!;
    const { router } = this.props;

    if (router && router.asPath) {
      // onRemove query

      const urlPath = router.asPath.replace(/(.*?)\?.*/, '$1');

      this.uiUrlForSelect = urlPath;
      // if (urlPath.replace === ''), SET asPath
      this.uiUrlForOpen = (urlPath.replace(/(^.*)\/.*/, '$1') || urlPath).replace(/\/item/, ''); // e.g. /news/item --> /news
    }

    // console.log(this.uiUrlForSelect, this.uiUrlForOpen);

    return (
      <Layout.Sider collapsible={false} className={style['full-layout-sidebar']}>
        <div className={style.logo}>
          <Link to="/">
            <img src="/static/images/logo_white.svg" alt="" width={40} />
          </Link>
        </div>

        {store.mapping && (
          <Menu
            className={style.menu}
            defaultSelectedKeys={[this.uiUrlForOpen]}
            defaultOpenKeys={[this.uiUrlForOpen]}
            selectable
            mode="inline"
            theme="dark"
          >
            {makeFlatMenuList(store.mapping.menuMapping)}
          </Menu>
        )}
      </Layout.Sider>
    );
  }
}
