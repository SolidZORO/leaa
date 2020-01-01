import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { CreateUserInput } from '@leaa/common/src/dtos/user';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_USER } from '@leaa/dashboard/src/graphqls';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { DivisionInfoForm } from '../_components/DivisionInfoForm/DivisionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateUserInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ user: CreateUserInput }>();
  const [createUserMutate, createUserMutation] = useMutation<{ createUser: User }>(CREATE_USER, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createUser }) {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push(`/users/${createUser.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateUserInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateUserInput> = {
      ...infoData,
    };

    await setSubmitVariables({ user: submitData });
    await createUserMutate();
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
      loading={createUserMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <DivisionInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createUserMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
