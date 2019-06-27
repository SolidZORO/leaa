import React from 'react';
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { Omit } from 'antd/lib/_util/type';

import { Link } from 'react-router-dom';
import { flatMenuList } from '@leaa/dashboard/configs/menu.config';
import style from './style.less';

interface IBreadcrumbItem {
  path: string;
  breadcrumbName: string;
  children: Omit<Route, 'children'>[];
}

export const Breadcrumb = () => {
  const spaceToSlash = (path: string) => (path === '' ? '/' : path);

  const breadcrumbList: IBreadcrumbItem[] = [];
  // const urlPath = (
  //   router &&
  //   router.asPath &&
  //   router.asPath.replace(/(.*?)\?.*/, '$1')
  // ) || '';
  const urlPath = '';

  let urlPathList = urlPath.split('/');

  // specialties Home
  if (urlPathList && urlPathList[0] === '' && urlPathList[1] === '') {
    urlPathList = [''];
  }

  // console.log(urlPathList);

  urlPathList.forEach((path, i) => {
    // join current path with urlPathList[index]
    // e.g. ['', 'news', '99'].slice(0, 2)
    //       ^    ^^^^  ------------------> ['', 'news'] --> '/news'
    const currentPath = spaceToSlash(urlPathList.slice(0, i + 1).join('/'));

    // find menu by flatMenuList
    const currentMenu = flatMenuList.find(m => m.pattern === currentPath);

    // not found name, use urlPathList[last]
    // e.g. /news/101, urlPathList[last] = 101
    const breadcrumbName = (currentMenu && currentMenu.name) || urlPathList[i];

    if (breadcrumbName && path === '') {
      breadcrumbList.push({ path: spaceToSlash(path), breadcrumbName, children: [] });
    } else if (breadcrumbName) {
      breadcrumbList.push({ path: currentPath, breadcrumbName, children: [] });
    }
  });

  const itemRender = (
    route: IBreadcrumbItem,
    params: Object,
    routes: IBreadcrumbItem[],
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
      <AntdBreadcrumb itemRender={itemRender} routes={breadcrumbList} />
    </div>
  );
};
