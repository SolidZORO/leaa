import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Promo } from '@leaa/common/src/entrys';
import { CreatePromoInput } from '@leaa/common/src/dtos/promo';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_PROMO } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { PromoInfoForm } from '../_components/PromoInfoForm/PromoInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreatePromoInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ promo: CreatePromoInput }>();
  const [createPromoMutate, createPromoMutation] = useMutation<{ createPromo: Promo }>(CREATE_PROMO, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted() {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push('/promos');
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreatePromoInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreatePromoInput> = {
      ...infoData,
    };

    await setSubmitVariables({ promo: submitData });
    await createPromoMutate();
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
      loading={false}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <PromoInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createPromoMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
