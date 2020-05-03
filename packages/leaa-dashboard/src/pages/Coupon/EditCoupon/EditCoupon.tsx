import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';
import { GET_COUPON, UPDATE_COUPON } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { CouponArgs, UpdateCouponInput } from '@leaa/common/src/dtos/coupon';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CouponInfoForm } from '../_components/CouponInfoForm/CouponInfoForm';
import { CouponCodeStatus } from '../_components/CouponCodeStatus/CouponCodeStatus';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateCouponInput>>(null);

  // query
  const getCouponVariables = { id };
  const getCouponQuery = useQuery<{ coupon: Coupon }, CouponArgs>(GET_COUPON, {
    variables: getCouponVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; coupon: UpdateCouponInput }>();
  const [updateCouponMutate, updateCouponMutation] = useMutation<Coupon>(UPDATE_COUPON, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgUtil.message(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_COUPON, variables: getCouponVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateCouponInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateCouponInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id, coupon: submitData });
    await updateCouponMutate();
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

      <CouponCodeStatus item={getCouponQuery.data?.coupon} loading={getCouponQuery.loading} />

      <CouponInfoForm ref={infoFormRef} item={getCouponQuery.data?.coupon} loading={getCouponQuery.loading} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateCouponMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
