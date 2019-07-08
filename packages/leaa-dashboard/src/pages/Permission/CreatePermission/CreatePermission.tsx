import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Permission } from '@leaa/common/entrys';
import { UpdatePermissionInput } from '@leaa/common/dtos/permission';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { PermissionInfoForm } from '@leaa/dashboard/pages/Permission/_components/PermissionInfoForm/PermissionInfoForm';
import { CREATE_PERMISSION } from '@leaa/common/graphqls/permission.mutation';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/constants';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let permissionInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ permission: UpdatePermissionInput }>({
    permission: {},
  });

  const [createPermissionMutate, { loading: submitLoading }] = useMutation<{ createPermission: Permission }>(
    CREATE_PERMISSION,
    {
      variables: submitVariables,
      onError(e) {
        message.error(e.message);
      },
      onCompleted({ createPermission }) {
        console.log(createPermission.id);
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
    <PageCard title={t(`${props.route.namei18n}`)} className={style['page-wapper']} loading={false}>
      <PermissionInfoForm
        wrappedComponentRef={(inst: unknown) => {
          permissionInfoFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={submitLoading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
