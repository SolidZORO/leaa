import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb } from 'antd';

import { Rcon } from '@leaa/dashboard/src/components';
import { flateMasterRoutes } from '@leaa/dashboard/src/routes/master.route';

import style from './style.module.less';

interface IProps extends RouteComponentProps {}

const routesTransBreadcrumbs = (routes: any) =>
  routes.reduce((acc: any, cur: any) => {
    acc[cur.path] = cur.namei18n || '';

    return acc;
  }, {});

const breadcrumbs = routesTransBreadcrumbs(flateMasterRoutes);
let home = _.pick(breadcrumbs, '/');
if (_.isEmpty(home)) home = { '/': '_route:home' };

export const NavBreadcrumb = (props: IProps) => {
  const { t } = useTranslation();

  // const pathSnippets = props.location?.pathname?.split('/')?.filter((i) => i);
  const pathSnippets = props.location?.pathname?.split('/')?.filter((i) => i);
  const extraBreadcrumbs = pathSnippets?.map((k, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`;

    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{t(breadcrumbs[url])}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key={`${Object.keys(home)}`}>
      <Link to={`${Object.keys(home)}`}>
        <Rcon type="ri-home-5-line" /> {t(Object.values(home))}
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbs);

  return (
    <div className={style['breadcrumb-wrapper']}>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};
