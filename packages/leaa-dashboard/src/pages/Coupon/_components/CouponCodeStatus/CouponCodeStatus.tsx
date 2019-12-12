import React from 'react';
import cx from 'classnames';
import { Col, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';

import { FormCard, CouponItem } from '@leaa/dashboard/src/components';
import { RedeemCouponToUseButton } from '../RedeemCouponToUseButton/RedeemCouponToUseButton';

import style from './style.module.less';

interface IProps {
  className?: string;
  item?: Coupon;
  loading?: boolean;
}

export const CouponCodeStatus = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={
          <div className={style['form-card-wrapper']}>
            <div className={style['coupon-title']}>{t('_page:Coupon.redeemToUser')}</div>

            {props.item && props.item.code && !props.item.user_id && (
              <div className={style['redeem-coupon-to-use-button']}>
                <RedeemCouponToUseButton item={props.item} />
              </div>
            )}
          </div>
        }
      >
        <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])} layout="inline">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={12}>
              <CouponItem type="coupon" item={props.item} />
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
};
