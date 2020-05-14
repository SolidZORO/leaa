import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Promo } from '@leaa/common/src/entrys';
import { GET_PROMO, UPDATE_PROMO } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PromoArgs, UpdatePromoInput } from '@leaa/common/src/dtos/promo';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msg } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { PromoInfoForm } from '../_components/PromoInfoForm/PromoInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdatePromoInput>>(null);

  // query
  const getPromoVariables = { id };
  const getPromoQuery = useQuery<{ promo: Promo }, PromoArgs>(GET_PROMO, {
    variables: getPromoVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; promo: UpdatePromoInput }>();
  const [updatePromoMutate, updatePromoMutation] = useMutation<Promo>(UPDATE_PROMO, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PROMO, variables: getPromoVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdatePromoInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdatePromoInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id, promo: submitData });
    await updatePromoMutate();
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
      loading={getPromoQuery.loading || updatePromoMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <PromoInfoForm ref={infoFormRef} item={getPromoQuery.data?.promo} loading={getPromoQuery.loading} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updatePromoMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
