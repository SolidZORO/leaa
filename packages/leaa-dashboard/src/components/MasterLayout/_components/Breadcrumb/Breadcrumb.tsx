import React from 'react';
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

import { Link, RouteComponentProps } from 'react-router-dom';
import { flateMasterRoutes } from '@leaa/dashboard/routes/master.route';

import style from './style.less';

interface IBreadcrumb {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

interface IProps extends RouteComponentProps {}

export const Breadcrumb = (props: IProps) => {
  const spaceToSlash = (path: string) => (path === '' ? '/' : path);

  const urlPath = (props && props.match && props.match.path.replace(/(.*?)\?.*/, '$1')) || '';

  let urlPathList = urlPath.split('/');

  // specialties Home
  if (urlPathList && urlPathList[0] === '' && urlPathList[1] === '') {
    urlPathList = [''];
  }

  const breadcrumbs: IBreadcrumb[] = [];

  urlPathList.forEach((path, i) => {
    // join current path with urlPathList[index]
    // e.g. ['', 'news', '99'].slice(0, 2)
    //       ^    ^^^^  ------------------> ['', 'news'] --> '/news'
    const currentPath = spaceToSlash(urlPathList.slice(0, i + 1).join('/'));

    // find menu by flatMenuList
    const currentMenu = flateMasterRoutes.find(m => m.path === currentPath);

    // not found name, use urlPathList[last]
    // e.g. /news/101, urlPathList[last] = 101
    const breadcrumbName = (currentMenu && currentMenu.name) || urlPathList[i];

    if (breadcrumbName && path === '') {
      breadcrumbs.push({ path: spaceToSlash(path), breadcrumbName, children: [] });
    } else if (breadcrumbName) {
      breadcrumbs.push({ path: currentPath, breadcrumbName, children: [] });
    }
  });

  const itemRender = (
    route: IBreadcrumb,
    params: {},
    routes: IBreadcrumb[],
    // paths: string[],
  ) => {
    const homeBreadcrumbItem = routes.indexOf(route) === 0;
    const lastBreadcrumbItem = routes.indexOf(route) === routes.length - 1;

    if (homeBreadcrumbItem && routes.length === 1) {
      return (
        <Link to={route.path}>
          <Icon type="home" /> {route.breadcrumbName}
        </Link>
      );
    }

    if (homeBreadcrumbItem) {
      return (
        <Link to={route.path}>
          <Icon type="home" />
        </Link>
      );
    }

    if (lastBreadcrumbItem) {
      return <em>{route.breadcrumbName}</em>;
    }

    return <Link to={route.path}>{route.breadcrumbName}</Link>;
  };

  return (
    <div className={style['breadcrumb-wrapper']}>
      <AntdBreadcrumb itemRender={itemRender} routes={breadcrumbs} />
    </div>
  );
};
