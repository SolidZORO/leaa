import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Promo } from '@leaa/common/src/entrys';
import { GET_PROMO, UPDATE_PROMO } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PromoArgs, UpdatePromoInput } from '@leaa/common/src/dtos/promo';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, ErrorCard, SubmitBar } from '@leaa/dashboard/src/components';

import { PromoInfoForm } from '../_components/PromoInfoForm/PromoInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [promoInfoFormRef, setPromoInfoFormRef] = useState<any>();

  // query
  const getPromoVariables = { id: Number(id) };
  const getPromoQuery = useQuery<{ promo: Promo }, PromoArgs>(GET_PROMO, {
    variables: getPromoVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; promo: UpdatePromoInput }>();
  const [updatePromoMutate, updatePromoMutation] = useMutation<Promo>(UPDATE_PROMO, {
    variables: submitVariables,
    onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PROMO, variables: getPromoVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdatePromoInput = {};

    promoInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: UpdatePromoInput) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;

      await setSubmitVariables({ id: Number(id), promo: submitData });
      await updatePromoMutate();
    });
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getPromoQuery.loading || updatePromoMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getPromoQuery.error ? <ErrorCard error={getPromoQuery.error} /> : null}
      {updatePromoMutation.error ? <ErrorCard error={updatePromoMutation.error} /> : null}

      <PromoInfoForm
        item={getPromoQuery.data && getPromoQuery.data.promo}
        loading={getPromoQuery.loading}
        wrappedComponentRef={(inst: unknown) => setPromoInfoFormRef(inst)}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updatePromoMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
