import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import { Typography, Icon, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';
import { priceUtil } from '@leaa/dashboard/src/utils';
import { PriceTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  className?: string;
  item?: Coupon;
  name?: JSX.Element;
  size?: 'small';
}

export const CouponItem = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(style['coupon-wrapper'], {
        [style['coupon-wrapper--small']]: props.size === 'small',
        [style['coupon-wrapper--disabled']]: props.item && !props.item.available,
      })}
    >
      <div className={style['coupon-inner']}>
        <Tooltip placement="right" title={t('_comp:CouponItem.unavailable')}>
          <div className={style['coupon-disabled']} />
        </Tooltip>

        <div className={cx(style['coupon-card'], style['coupon-card--left'])}>
          <div className={style['coupon-card-inner']}>
            <div className={style['amount']}>{props.item && <PriceTag amount={props.item && props.item.amount} />}</div>

            {Boolean(props.item && props.item.over_amount && props.item.over_amount > 0) && (
              <div className={style['over-amount']}>
                {t('_comp:CouponItem.moreThanAmount')} <PriceTag amount={props.item && props.item.over_amount} />{' '}
                {t('_comp:CouponItem.isAvailable')}
              </div>
            )}
          </div>
        </div>

        <div className={cx(style['coupon-card'], style['coupon-card--right'])}>
          <div className={style['coupon-card-inner']}>
            <div className={style['name']}>{props.name || (props.item && props.item.name)}</div>

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
