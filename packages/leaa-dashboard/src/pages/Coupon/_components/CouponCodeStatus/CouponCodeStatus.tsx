import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import { Col, Form, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';

import { FormCard, CouponItem } from '@leaa/dashboard/src/components';
import { ConvertCouponToUseButton } from '../ConvertCouponToUseButton/ConvertCouponToUseButton';

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
            <div className={style['coupon-title']}>{t('_page:Coupon.Component.couponCodeStatusTitle')}</div>

            {props.item && props.item.code && !props.item.user_id && (
              <div className={style['convert-coupon-to-use-button']}>
                <ConvertCouponToUseButton item={props.item} />
              </div>
            )}
          </div>
        }
      >
        <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])} layout="inline">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={12}>
              <CouponItem item={props.item} />
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
};
