import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';
import { RedeemCouponInput } from '@leaa/common/src/dtos/coupon';
import { IPage, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { REDEEM_COUPON } from '@leaa/dashboard/src/graphqls';
import { msgMessage } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, Rcon } from '@leaa/dashboard/src/components';

import { CouponRedeemForm } from '../_components/CouponRedeemForm/CouponRedeemForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const couponRedeemRef = useRef<any>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ info: RedeemCouponInput }>();
  const [redeemCouponMutate, redeemCouponMutation] = useMutation<{ coupon: Coupon }>(REDEEM_COUPON, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted(e) {
      msgMessage(t('_lang:createdSuccessfully'));
      // props.history.push('/coupons');
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<RedeemCouponInput> = await couponRedeemRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<RedeemCouponInput> = {
      ...infoData,
    };

    await setSubmitVariables({ info: submitData });
    await redeemCouponMutate();
  };

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={redeemCouponMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <CouponRedeemForm
        ref={couponRedeemRef}
        className={style['coupon-redeem-form-wrapper']}
        submitButton={
          <Button
            type="primary"
            size="large"
            icon={<Rcon type="ri-swap-box-line" />}
            className="g-submit-bar-button"
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
