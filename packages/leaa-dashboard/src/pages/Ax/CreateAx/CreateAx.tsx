import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/src/entrys';
import { CreateAxInput } from '@leaa/common/src/dtos/ax';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { CREATE_AX } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [axInfoFormRef, setAxInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ ax: CreateAxInput }>();
  const [createAxMutate, createAxMutation] = useMutation<{ createAx: Ax }>(CREATE_AX, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createAx }) {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push(`/axs/${createAx.id}`);
    },
  });

  const onSubmit = async () => {
    axInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateAxInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ ax: formData });
      await createAxMutate();
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
      loading={createAxMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <AxInfoForm wrappedComponentRef={(inst: unknown) => setAxInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createAxMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
