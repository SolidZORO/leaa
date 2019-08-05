import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/entrys';
import { UpdateUserInput } from '@leaa/common/dtos/user';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { IPage } from '@leaa/dashboard/interfaces';
import { CREATE_USER } from '@leaa/common/graphqls';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { HtmlTitle } from '@leaa/dashboard/components/HtmlTitle';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let userInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ user: UpdateUserInput }>({
    user: {},
  });

  const [createUserMutate, createUserMutation] = useMutation<{ createUser: User }>(CREATE_USER, {
    variables: submitVariables,
    onCompleted({ createUser }) {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/users/${createUser.id}`);
    },
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateUserInput = {};

    userInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: User) => {
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
      <HtmlTitle title={t(`${props.route.namei18n}`)} />

      {createUserMutation.error ? <ErrorCard error={createUserMutation.error} /> : null}

      <UserInfoForm
        wrappedComponentRef={(inst: unknown) => {
          userInfoFormRef = inst;
        }}
      />

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
