import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { CreateUserInput } from '@leaa/common/src/dtos/user';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_USER } from '@leaa/common/src/graphqls';

import { HtmlMeta, PageCard, ErrorCard, SubmitBar } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [userInfoFormRef, setUserInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ user: CreateUserInput }>();
  const [createUserMutate, createUserMutation] = useMutation<{ createUser: User }>(CREATE_USER, {
    variables: submitVariables,
    onCompleted({ createUser }) {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/users/${createUser.id}`);
    },
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: CreateUserInput = {} as CreateUserInput;

    userInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateUserInput) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    if (hasError) {
      return;
    }

    await setSubmitVariables({
      ...submitVariables,
      ...{ user: submitData },
    });
    await createUserMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={createUserMutation.loading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {createUserMutation.error ? <ErrorCard error={createUserMutation.error} /> : null}

      <UserInfoForm wrappedComponentRef={(inst: unknown) => setUserInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createUserMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
