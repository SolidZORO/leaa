import React, { useState } from 'react';
import { Button, Icon, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { CreateUserInput } from '@leaa/common/src/dtos/user';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_USER } from '@leaa/common/src/graphqls';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar } from '@leaa/dashboard/src/components';

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
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createUser }) {
      messageUtil.gqlCompleted(t('_lang:createdSuccessfully'));
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
    <PageCard
      title={
        <span>
          <Icon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={createUserMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

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
