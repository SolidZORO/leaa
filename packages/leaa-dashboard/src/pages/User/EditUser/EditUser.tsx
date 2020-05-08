import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { GET_USER, GET_ROLES, UPDATE_USER } from '@leaa/dashboard/src/graphqls';
import { RolesWithPaginationObject, RolesArgs } from '@leaa/common/src/dtos/role';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { UserArgs, UpdateUserInput } from '@leaa/common/src/dtos/user';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';
import { UploadUserAvatar } from '../_components/UploadUserAvatar/UploadUserAvatar';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateUserInput>>(null);
  const userRolesFormRef = useRef<ICommenFormRef<UpdateUserInput>>(null);

  // query
  const getUserVariables = { id: id };
  const getUserQuery = useQuery<{ user: User }, UserArgs>(GET_USER, {
    variables: getUserVariables,
    fetchPolicy: 'network-only',
  });

  const getRolesVariables = { pageSize: 9999 };
  const getRolesQuery = useQuery<{ roles: RolesWithPaginationObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; user: UpdateUserInput }>({
    id: id,
    user: {},
  });
  const [updateUserMutate, updateUserMutation] = useMutation<User>(UPDATE_USER, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgMessage(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_USER, variables: getUserVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateUserInput> = await infoFormRef.current?.onValidateForm();
    const userRolesData: ISubmitData<UpdateUserInput> = await userRolesFormRef.current?.onValidateForm();

    if (!infoData) return;
    if (!userRolesData) return;

    const submitData: ISubmitData<UpdateUserInput> = {
      ...infoData,
      ...userRolesData,
    };

    await setSubmitVariables({ id: id, user: submitData });
    await updateUserMutate();
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
      loading={getUserQuery.loading || updateUserMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <UploadUserAvatar item={getUserQuery.data?.user} loading={getUserQuery.loading} />

      <UserInfoForm ref={infoFormRef} item={getUserQuery.data?.user} loading={getUserQuery.loading} />

      <UserRolesForm
        ref={userRolesFormRef}
        item={getUserQuery.data?.user}
        loading={getRolesQuery.loading}
        roles={getRolesQuery.data?.roles?.items || []}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateUserMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
