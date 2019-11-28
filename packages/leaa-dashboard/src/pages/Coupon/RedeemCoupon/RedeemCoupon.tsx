import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';
import { RedeemCouponInput } from '@leaa/common/src/dtos/coupon';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { REDEEM_COUPON } from '@leaa/common/src/graphqls';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard } from '@leaa/dashboard/src/components';

import { CouponRedeemForm } from '../_components/CouponRedeemForm/CouponRedeemForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [couponRedeemFormRef, setCouponRedeemFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ info: RedeemCouponInput }>();
  const [redeemCouponMutate, redeemCouponMutation] = useMutation<{ coupon: Coupon }>(REDEEM_COUPON, {
    variables: submitVariables,
    onError: e => message.error(messageUtil.formatGqlmessage(e.message)),
    onCompleted() {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push('/coupons');
    },
  });

  const onSubmit = async () => {
    couponRedeemFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: RedeemCouponInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ info: formData });
      await redeemCouponMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={redeemCouponMutation.loading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <CouponRedeemForm
        className={style['coupon-redeem-form-wrapper']}
        wrappedComponentRef={(inst: unknown) => setCouponRedeemFormRef(inst)}
        submitButton={
          <Button
            type="primary"
            size="large"
            icon="x-exchange"
            className="submit-button"
            loading={redeemCouponMutation.loading}
            onClick={onSubmit}
            // className={style['coupon-redeem-form-wrapper']}
          >
            {t('_lang:redeem')}
          </Button>
        }
      />
    </PageCard>
  );
};
