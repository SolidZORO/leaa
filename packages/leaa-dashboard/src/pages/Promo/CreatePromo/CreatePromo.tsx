import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Promo } from '@leaa/common/src/entrys';
import { CreatePromoInput } from '@leaa/common/src/dtos/promo';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { CREATE_PROMO } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { PromoInfoForm } from '../_components/PromoInfoForm/PromoInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [promoInfoFormRef, setPromoInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ promo: CreatePromoInput }>();
  const [createPromoMutate, createPromoMutation] = useMutation<{ createPromo: Promo }>(CREATE_PROMO, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted() {
      messageUtil.gqlCompleted(t('_lang:createdSuccessfully'));
      props.history.push('/promos');
    },
  });

  const onSubmit = async () => {
    promoInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreatePromoInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ promo: formData });
      await createPromoMutate();
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
      loading={createPromoMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <PromoInfoForm wrappedComponentRef={(inst: unknown) => setPromoInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createPromoMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
