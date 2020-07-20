import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Spin, Button, Tooltip, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { RiAddLine, RiFilterLine } from 'react-icons/ri';
import { mergeUrlParamToUrlQuery, getFieldByUrl } from '@leaa/dashboard/src/utils';

import { useUpdateEffect } from 'react-use';

import style from './style.module.less';

declare type IPropTitle = null | '@LIST' | '@UPDATE' | '@CREATE' | '@ITEM' | React.ReactNode;

interface IFilterItem {
  label: string;
  content?: React.ReactNode;
}

interface IProps {
  children: React.ReactNode;
  title?: IPropTitle;
  extra?: React.ReactNode;
  filter?: IFilterItem[];
  filterCloseCallback?: () => void;
  className?: string;
  route: IRouteItem;
  loading?: boolean;
}

export const PageCard = (props: IProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [filterShow, setFilterShow] = useState(Number(getFieldByUrl('filterbar')));

  const genTitltDom = (title?: IPropTitle) => {
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
        <>
          <strong className={style['title-name']}>{t(`${props.route?.namei18n}`)}</strong>
          {props.route?.canCreate && createButtonDom(props.route?.path)}
        </>
      );
    }

    // Page 里面 title 还是该写什么写什么，不知道那天这里会出现 if 判断
    if (_.isString(title) && ['@UPDATE', '@CREATE', '@ITEM'].includes(title)) {
      const routePathMatch = props.route?.path?.match(/^(\/.*)\//);

      return (
        <>
          <strong className={style['title-name']}>{t(`${props.route?.namei18n}`)}</strong>
          {['@UPDATE', '@ITEM'].includes(title) && (
            <div className={style['page-card-create-button-in-non-list-wrapper']}>
              {createButtonDom(routePathMatch ? routePathMatch[1] : props.route?.path)}
            </div>
          )}
        </>
      );
    }

    return title;
  };

  const onSwitchFilter = (status: boolean) => {
    if (!status && props.filterCloseCallback) props.filterCloseCallback();

    setFilterShow(Number(status));

    mergeUrlParamToUrlQuery({
      window,
      params: { filterbar: status ? 1 : undefined },
      replace: true,
    });
  };

  // if you click on sidebar routePath === current routePath, close & reset filter
  useUpdateEffect(() => {
    setFilterShow(0);

    if (props.filterCloseCallback) props.filterCloseCallback();
  }, [history.location.key]);

  return (
    <div className={cx(style['page-card-wrapper'], props.className)}>
      <div className={style['header']}>
        <div className={style['title-bar']}>
          <div className={style['title-wrapper']}>{genTitltDom(props.title)}</div>

          <div className={style['fn-wrapper']}>
            {props.filter && props.title === '@LIST' && (
              <Button
                onClick={() => onSwitchFilter(!filterShow)}
                icon={<RiFilterLine />}
                size="large"
                className={cx(style['filter-button'], 'g-page-card-filter-button', {
                  [style['filter-button--show']]: filterShow,
                })}
              />
            )}

            {props.extra && <div className={cx(style['extra'], 'g-page-card-extra')}>{props.extra}</div>}
          </div>
        </div>

        {props.filter && (
          <div
            className={cx(style['filter-bar'], 'g-page-card-filter-bar', {
              [style['filter-bar--show']]: filterShow,
            })}
          >
            <Collapse
              ghost
              expandIcon={() => null}
              activeKey={filterShow}
              className={cx(style['filter-collapse'], 'g-page-card-filter-collapse')}
            >
              <Collapse.Panel header={null} key={1} forceRender className={style['filter-panel']}>
                <div className={cx(style['filter-container'], 'g-page-card-filter-container')}>
                  {Array.isArray(props.filter) &&
                    props.filter.map((item: IFilterItem) => (
                      <div className={cx(style['filter-bar-item'])} key={item?.label}>
                        <div className={style['filter-bar-item-label']}>{item?.label}</div>
                        <div className={style['filter-bar-item-content']}>{item?.content}</div>
                      </div>
                    ))}
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        )}
      </div>

      <Spin spinning={props.loading} className={style['spin']}>
        <div className={style['container']}>{props.children}</div>
      </Spin>
    </div>
  );
};
