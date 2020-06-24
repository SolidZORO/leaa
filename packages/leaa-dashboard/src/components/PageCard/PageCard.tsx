import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { RiAddLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import style from './style.module.less';

declare type IPropTitle = null | '@LIST' | '@EDIT' | '@CREATE' | '@ITEM' | React.ReactNode;

interface IProps {
  children: React.ReactNode;
  title?: IPropTitle;
  extra?: React.ReactNode;
  className?: string;
  route: IRouteItem;
  complexExtra?: boolean;
  loading?: boolean;
}

export const PageCard = (props: IProps) => {
  const { t } = useTranslation();

  const genTitlt = (title?: IPropTitle) => {
    if (!title) return null;

    if (_.isString(title) && title === '@LIST')
      return (
        <div className={style['title']}>
          <span>
            {props.route?.icon}
            <strong>{t(`${props.route?.namei18n}`)}</strong>
            {props.route?.canCreate && (
              <Link className="g-page-card-create-link" to={`${props.route?.path}/create`}>
                <RiAddLine title="PAGE_CARD_TITLE_CREATE_ICON" />
              </Link>
            )}
          </span>
        </div>
      );

    // Page 里面 title 还是该写什么写什么，不知道那天这里会出现 if 判断
    if (_.isString(title) && ['@EDIT', '@CREATE', '@ITEM'].includes(title))
      return (
        <div className={style['title']}>
          <span>
            {props.route?.icon}
            <strong>{t(`${props.route?.namei18n}`)}</strong>
          </span>
        </div>
      );

    return <div className={style['title']}>{title}</div>;
  };

  return (
    <div
      className={cx(style['page-card-wrapper'], props.className, {
        [style['page-card-wrapper--complex']]: props.complexExtra,
      })}
    >
      <div className={style['header']}>
        {genTitlt(props.title)}

        {props.extra && <div className={style['extra']}>{props.extra}</div>}
      </div>

      <Spin spinning={props.loading} className={style['spin']}>
        <div className={style['container']}>{props.children}</div>
      </Spin>
    </div>
  );
};
