import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Permission } from '@leaa/common/src/entrys';
import { UpdatePermissionInput } from '@leaa/common/src/dtos/permission';
import { IPage } from '@leaa/dashboard/src/interfaces';
// eslint-disable-next-line max-len
import { PermissionInfoForm } from '@leaa/dashboard/src/pages/Permission/_components/PermissionInfoForm/PermissionInfoForm';
import { CREATE_PERMISSION } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { SubmitBar } from '@leaa/dashboard/src/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [permissionInfoFormRef, setPermissionInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ permission: UpdatePermissionInput }>({ permission: {} });
  const [createPermissionMutate, createPermissionMutation] = useMutation<{ createPermission: Permission }>(
    CREATE_PERMISSION,
    {
      variables: submitVariables,
      onError: e => message.error(e.message),
      onCompleted({ createPermission }) {
        message.success(t('_lang:createdSuccessfully'));
        props.history.push(`/permissions/${createPermission.id}`);
      },
    },
  );

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdatePermissionInput = {};

    permissionInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Permission) => {
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
      ...{ permission: submitData },
    });
    await createPermissionMutate();
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={createPermissionMutation.loading}
    >
      {createPermissionMutation.error ? <ErrorCard error={createPermissionMutation.error} /> : null}

      <PermissionInfoForm wrappedComponentRef={(inst: unknown) => setPermissionInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createPermissionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
