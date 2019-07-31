import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/entrys';
import { UpdateAxInput } from '@leaa/common/dtos/ax';
import { IPage } from '@leaa/dashboard/interfaces';
import { CREATE_AX } from '@leaa/common/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { HtmlTitle } from '@leaa/dashboard/components/HtmlTitle';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let axInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ ax: UpdateAxInput }>();

  const [createAxMutate, createAxMutation] = useMutation<{ createAx: Ax }>(CREATE_AX, {
    variables: submitVariables,
    onError: e => message.error(e.message),
    onCompleted({ createAx }) {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/axs/${createAx.id}`);
    },
  });

  const onSubmit = async () => {
    axInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Ax) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);
        return;
      }

      await setSubmitVariables({ ax: formData });
      await createAxMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={createAxMutation.loading}>
      <HtmlTitle title={t(`${props.route.namei18n}`)} />

      {createAxMutation.error ? <ErrorCard error={createAxMutation.error} /> : null}

      <AxInfoForm
        wrappedComponentRef={(inst: unknown) => {
          axInfoFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createAxMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
