import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb } from 'antd';

import { Rcon } from '@leaa/dashboard/src/components';
import { flateMasterRoutes } from '@leaa/dashboard/src/routes/master.route';

import style from './style.module.less';

interface IProps extends RouteComponentProps {}

const routesTransBreadcrumbs = (rs: any) =>
  rs.reduce((acc: any, cur: any) => {
    acc[cur.path] = cur.namei18n || '';

    return acc;
  }, {});

const breadcrumbs = routesTransBreadcrumbs(flateMasterRoutes);
const breadcrumbHome = _.pick(breadcrumbs, '/');

export const NavBreadcrumb = (props: IProps) => {
  const { t } = useTranslation();
  const { location } = props;

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((k, i) => {
    const url = `/${pathSnippets.slice(0, i + 1).join('/')}`;

    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{t(breadcrumbs[url])}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key={`${Object.keys(breadcrumbHome)}`}>
      <Link to={`${Object.keys(breadcrumbHome)}`}>
        <Rcon type="ri-home-5-line" /> {t(Object.values(breadcrumbHome))}
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className={style['breadcrumb-wrapper']}>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};
