import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Division } from '@leaa/common/src/entrys';
import { CreateDivisionInput } from '@leaa/common/src/dtos/division';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_DIVISION } from '@leaa/dashboard/src/graphqls';
import { msg } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { DivisionInfoForm } from '../_components/DivisionInfoForm/DivisionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateDivisionInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ division: CreateDivisionInput }>();
  const [createDivisionMutate, createDivisionMutation] = useMutation<{ createDivision: Division }>(CREATE_DIVISION, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createDivision }) {
      msg(t('_lang:createdSuccessfully'));
      props.history.push(`/divisions/${createDivision.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateDivisionInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateDivisionInput> = {
      ...infoData,
    };

    await setSubmitVariables({ division: submitData });
    await createDivisionMutate();
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
      loading={createDivisionMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <DivisionInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createDivisionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
