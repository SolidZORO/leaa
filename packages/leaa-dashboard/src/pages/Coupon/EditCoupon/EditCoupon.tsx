import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';
import { GET_COUPON, UPDATE_COUPON } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { CouponArgs, UpdateCouponInput } from '@leaa/common/src/dtos/coupon';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CouponInfoForm } from '../_components/CouponInfoForm/CouponInfoForm';
import { CouponCodeStatus } from '../_components/CouponCodeStatus/CouponCodeStatus';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [couponInfoFormRef, setCouponInfoFormRef] = useState<any>();

  // query
  const getCouponVariables = { id: Number(id) };
  const getCouponQuery = useQuery<{ coupon: Coupon }, CouponArgs>(GET_COUPON, {
    variables: getCouponVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; coupon: UpdateCouponInput }>();
  const [updateCouponMutate, updateCouponMutation] = useMutation<Coupon>(UPDATE_COUPON, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_COUPON, variables: getCouponVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateCouponInput = {};

    couponInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: UpdateCouponInput) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;

      await setSubmitVariables({ id: Number(id), coupon: submitData });
      await updateCouponMutate();
    });
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
      loading={getCouponQuery.loading || updateCouponMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <CouponCodeStatus item={getCouponQuery.data && getCouponQuery.data.coupon} loading={getCouponQuery.loading} />

      <CouponInfoForm
        item={getCouponQuery.data && getCouponQuery.data.coupon}
        loading={getCouponQuery.loading}
        wrappedComponentRef={(inst: unknown) => setCouponInfoFormRef(inst)}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateCouponMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
