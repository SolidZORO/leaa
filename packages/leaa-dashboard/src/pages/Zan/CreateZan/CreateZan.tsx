import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { Zan } from '@leaa/common/src/entrys';
import { CREATE_ZAN } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { CreateZanInput } from '@leaa/common/src/dtos/zan';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgMessage } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ZanInfoForm } from '../_components/ZanInfoForm/ZanInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateZanInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ zan: CreateZanInput }>();
  const [createZanMutate, createZanMutation] = useMutation<{ createZan: Zan }>(CREATE_ZAN, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createZan }) {
      msgMessage(t('_lang:createdSuccessfully'));
      props.history.push(`/zans/${createZan.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateZanInput> = await infoFormRef.current?.onValidateForm();

    console.log(infoData);

    if (!infoData) return;

    const submitData: ISubmitData<CreateZanInput> = {
      ...infoData,
    };

    await setSubmitVariables({ zan: submitData });
    await createZanMutate();
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
      loading={createZanMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ZanInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createZanMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
