import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import { Typography, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';
import { PriceTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  type: 'coupon' | 'promo';
  className?: string;
  item?: Coupon;
  name?: JSX.Element;
  size?: 'small';
}

export const CouponItem = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(style['wrapper'], style[`wrapper--${props.type}`], {
        [style['wrapper--small']]: props.size === 'small',
        [style['wrapper--disabled']]: props.item && !props.item.available,
      })}
    >
      <div className={style['inner']}>
        <Tooltip placement="right" title={t('_comp:CouponItem.unavailable')}>
          <div className={style['disabled']} />
        </Tooltip>

        <div className={cx(style['card'], style['card--left'])}>
          <div className={style['card-inner']}>
            <div className={style['amount']}>{props.item && <PriceTag amount={props.item && props.item.amount} />}</div>

            {Boolean(props.item && props.item.over_amount && props.item.over_amount > 0) && (
              <div className={style['over-amount']}>
                {t('_comp:CouponItem.moreThanAmount')} <PriceTag amount={props.item && props.item.over_amount} />{' '}
                {t('_comp:CouponItem.isAvailable')}
              </div>
            )}
          </div>
        </div>

        <div className={cx(style['card'], style['card--right'])}>
          <div className={style['card-inner']}>
            <div className={style['name']}>
              {props.name || (props.item && props.item.name)}{' '}
              {props.type === 'promo' && (
                <Typography.Text className={style['copy-code']} copyable={{ text: props.item && props.item.name }} />
              )}
            </div>

            <div className={style['date-range']}>
              <span>{moment(props.item && props.item.start_time).format('YYYY-MM-DD')}</span>
              <span className={style['date-range-line']}>~</span>
              <span>{moment(props.item && props.item.expire_time).format('YYYY-MM-DD')}</span>
            </div>

            {props.type === 'coupon' && (
              <div className={style['code']}>
                <strong>{props.item && props.item.code}</strong>
                <Typography.Text className={style['copy-code']} copyable={{ text: props.item && props.item.code }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
