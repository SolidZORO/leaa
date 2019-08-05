import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Permission } from '@leaa/common/entrys';
import { GET_PERMISSION, UPDATE_PERMISSION } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { PermissionArgs, UpdatePermissionInput } from '@leaa/common/dtos/permission';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { HtmlTitle } from '@leaa/dashboard/components/HtmlTitle';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';

import { PermissionInfoForm } from '../_components/PermissionInfoForm/PermissionInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let permissionInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ id: number; permission: UpdatePermissionInput }>({
    id: Number(id),
    permission: {},
  });

  const getPermissionVariables = { id: Number(id) };
  const getPermissionQuery = useQuery<{ permission: Permission }, PermissionArgs>(GET_PERMISSION, {
    variables: getPermissionVariables,
    fetchPolicy: 'network-only',
  });

  const [updatePermissionMutate, updatePermissionMutation] = useMutation<Permission>(UPDATE_PERMISSION, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PERMISSION, variables: getPermissionVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdatePermissionInput = {};

    permissionInfoFormRef.props.form.validateFieldsAndScroll((err: any, formData: Permission) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = formData;
    });

    if (hasError) {
      return;
    }

    const nextSubmitData = { id: Number(id), permission: submitData };

    console.log(nextSubmitData);

    await setSubmitVariables(nextSubmitData);
    await updatePermissionMutate();
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getPermissionQuery.loading || updatePermissionMutation.loading}
    >
      <HtmlTitle title={t(`${props.route.namei18n}`)} />

      {getPermissionQuery.error ? <ErrorCard error={getPermissionQuery.error} /> : null}
      {updatePermissionMutation.error ? <ErrorCard error={updatePermissionMutation.error} /> : null}

      <PermissionInfoForm
        item={getPermissionQuery.data && getPermissionQuery.data.permission}
        loading={getPermissionQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          permissionInfoFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updatePermissionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
