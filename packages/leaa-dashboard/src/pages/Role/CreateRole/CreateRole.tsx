import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Role } from '@leaa/common/entrys';
import { UpdateRoleInput } from '@leaa/common/dtos/role';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { RoleInfoForm } from '@leaa/dashboard/pages/Role/_components/RoleInfoForm/RoleInfoForm';
import { CREATE_ROLE } from '@leaa/common/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/constants';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let roleInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ role: UpdateRoleInput }>({
    role: {},
  });

  const [createRoleMutate, { loading: submitLoading }] = useMutation<{ createRole: Role }>(CREATE_ROLE, {
    variables: submitVariables,
    onError(e) {
      message.error(e.message);
    },
    onCompleted({ createRole }) {
      console.log(createRole.id);
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/roles/${createRole.id}`);
    },
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateRoleInput = {};

    roleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Role) => {
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
      ...{ role: submitData },
    });
    await createRoleMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['page-wapper']} loading={false}>
      <RoleInfoForm
        wrappedComponentRef={(inst: unknown) => {
          roleInfoFormRef = inst;
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
