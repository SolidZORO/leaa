import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';
import { priceUtil } from '@leaa/dashboard/src/utils';
import { PriceTag } from '@leaa/dashboard/src/components';

import style from './style.less';

interface IProps {
  className?: string;
  item?: Coupon;
  title?: JSX.Element;
  size?: 'small';
}

export const CouponItem = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(style['coupon-wrapper'], {
        [style['coupon-wrapper--small']]: props.size === 'small',
      })}
    >
      <div className={style['coupon-inner']}>
        <div className={cx(style['coupon-card'], style['coupon-card--left'])}>
          <div className={style['coupon-card-inner']}>
            <div className={style['amount']}>{props.item && <PriceTag amount={props.item && props.item.amount} />}</div>

            {Boolean(props.item && props.item.over_amount && props.item.over_amount > 0) && (
              <div className={style['over-amount']}>
                满 <PriceTag amount={props.item && props.item.over_amount} /> 可用
              </div>
            )}
          </div>
        </div>

        <div className={cx(style['coupon-card'], style['coupon-card--right'])}>
          <div className={style['coupon-card-inner']}>
            <div className={style['title']}>{props.title || (props.item && props.item.slug)}</div>

            <div className={style['date-range']}>
              <span>{moment(props.item && props.item.start_time).format('YYYY-MM-DD')}</span>
              <span className={style['date-range-line']}>~</span>
              <span>{moment(props.item && props.item.expire_time).format('YYYY-MM-DD')}</span>
            </div>

            <div className={style['coupon-code']}>
              <strong>{props.item && props.item.code}</strong>
              <Typography.Text className={style['copy-code']} copyable={{ text: props.item && props.item.code }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
