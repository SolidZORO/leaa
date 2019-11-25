import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';
import { CreateCouponInput } from '@leaa/common/src/dtos/coupon';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_COUPON } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';

import { HtmlMeta, PageCard, ErrorCard, SubmitBar } from '@leaa/dashboard/src/components';

import { ConvertCouponForm } from '../_components/ConvertCouponForm/ConvertCouponForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [convertCouponFormRef, setConvertCouponFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ coupon: CreateCouponInput }>();
  const [createCouponMutate, createCouponMutation] = useMutation<{ createCoupon: Coupon }>(CREATE_COUPON, {
    variables: submitVariables,
    onError: e => message.error(e.message),
    onCompleted() {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push('/coupons');
    },
  });

  const onSubmit = async () => {
    convertCouponFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateCouponInput) => {
      console.log(formData);

      return;

      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ coupon: formData });
      await createCouponMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={createCouponMutation.loading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {createCouponMutation.error ? <ErrorCard error={createCouponMutation.error} /> : null}

      <ConvertCouponForm wrappedComponentRef={(inst: unknown) => setConvertCouponFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon="x-exchange"
          className="submit-button"
          loading={createCouponMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:convert')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
