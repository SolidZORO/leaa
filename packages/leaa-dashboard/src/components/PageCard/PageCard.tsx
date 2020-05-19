import React from 'react';
import cx from 'classnames';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';

import { Rcon } from '@leaa/dashboard/src/components';
import { Link } from 'react-router-dom';
import { PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  route?: IRouteItem;
  loading?: boolean;
}

export const PageCard = (props: IProps) => {
  const { t } = useTranslation();

  const defaultTitle = (
    <span>
      <Rcon type={props.route?.icon} />
      <strong>{t(`${props.route?.namei18n}`)}</strong>
      {props.route?.canCreate && (
        <Link className="g-page-card-create-link" to={`${props.route?.path}/create`}>
          <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
        </Link>
      )}
    </span>
  );

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <div className={style['header']}>
        {props.title === null && null}
        {props.title !== null && <div className={style['title']}>{props.title || defaultTitle}</div>}

        {props.extra && <div className={style['extra']}>{props.extra}</div>}
      </div>

      <Spin spinning={props.loading} className={style['spin']}>
        <div className={style['container']}>{props.children}</div>
      </Spin>
    </div>
  );
};
