import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { Spin, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { RiAddLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import style from './style.module.less';

declare type IPropTitle = null | '@LIST' | '@UPDATE' | '@CREATE' | '@ITEM' | React.ReactNode;

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
    // path e.g. '/articles'
    const createButtonDom = (routePath: string) => (
      <Link className={cx(style['page-card-create-link'], 'g-page-card-create-link')} to={`${routePath}/create`}>
        <Tooltip
          title={t('_lang:create')}
          placement="right"
          overlayClassName="g-page-card-create-button-tooltip"
          mouseEnterDelay={1}
          // @ts-ignore
          color="#fff"
        >
          <Button
            size="large"
            shape="round"
            type="ghost"
            icon={<RiAddLine />}
            className={cx(style['page-card-create-button'], 'g-page-card-create-button')}
          >
            {t('_lang:create')}
          </Button>
        </Tooltip>
      </Link>
    );

    if (!title) return null;

    if (_.isString(title) && title === '@LIST') {
      return (
        <div className={style['title']}>
          <span>
            <strong>{t(`${props.route?.namei18n}`)}</strong>
            {props.route?.canCreate && createButtonDom(props.route?.path)}
          </span>
        </div>
      );
    }

    // Page 里面 title 还是该写什么写什么，不知道那天这里会出现 if 判断
    if (_.isString(title) && ['@UPDATE', '@CREATE', '@ITEM'].includes(title)) {
      const routePathMatch = props.route?.path?.match(/^(\/.*)\//);

      return (
        <div className={style['title']}>
          <span>
            <strong>{t(`${props.route?.namei18n}`)}</strong>
            {['@UPDATE', '@ITEM'].includes(title) && (
              <div className={style['page-card-create-button-in-update-wrapper']}>
                {createButtonDom(routePathMatch ? routePathMatch[1] : props.route?.path)}
              </div>
            )}
          </span>
        </div>
      );
    }

    return <div className={style['title']}>{title}</div>;
  };

  return (
    <div
      className={cx(style['page-card-wrapper'], props.className, {
        [style['page-card-wrapper--complex']]: props.complexExtra,
      })}
    >
      <div className={style['header']}>
        <div className={style['title-wrapper']}>{genTitlt(props.title)}</div>

        {props.extra && <div className={style['extra']}>{props.extra}</div>}
      </div>

      <Spin spinning={props.loading} className={style['spin']}>
        <div className={style['container']}>{props.children}</div>
      </Spin>
    </div>
  );
};
