import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Permission } from '@leaa/common/src/entrys';
import { GET_PERMISSION, UPDATE_PERMISSION } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PermissionArgs, UpdatePermissionInput } from '@leaa/common/src/dtos/permission';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { PermissionInfoForm } from '../_components/PermissionInfoForm/PermissionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdatePermissionInput>>(null);

  // query
  const getPermissionVariables = { id };
  const getPermissionQuery = useQuery<{ permission: Permission }, PermissionArgs>(GET_PERMISSION, {
    variables: getPermissionVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; permission: UpdatePermissionInput }>();
  const [updatePermissionMutate, updatePermissionMutation] = useMutation<Permission>(UPDATE_PERMISSION, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgMessage(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PERMISSION, variables: getPermissionVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdatePermissionInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdatePermissionInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id, permission: submitData });
    await updatePermissionMutate();
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
      loading={getPermissionQuery.loading || updatePermissionMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <PermissionInfoForm
        ref={infoFormRef}
        item={getPermissionQuery.data?.permission}
        loading={getPermissionQuery.loading}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updatePermissionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
