import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/src/entrys';
import { CREATE_AX } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { CreateAxInput } from '@leaa/common/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateAxInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ ax: CreateAxInput }>();
  const [createAxMutate, createAxMutation] = useMutation<{ createAx: Ax }>(CREATE_AX, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createAx }) {
      msgUtil.message(t('_lang:createdSuccessfully'));
      props.history.push(`/axs/${createAx.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateAxInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateAxInput> = {
      ...infoData,
    };

    await setSubmitVariables({ ax: submitData });
    await createAxMutate();
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

      <AxInfoForm ref={infoFormRef} />

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
