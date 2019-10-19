import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Role } from '@leaa/common/src/entrys';
import { UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { RoleInfoForm } from '@leaa/dashboard/src/pages/Role/_components/RoleInfoForm/RoleInfoForm';
import { CREATE_ROLE } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { HtmlMeta } from '@leaa/dashboard/src/components/HtmlMeta';
import { SubmitBar } from '@leaa/dashboard/src/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [roleInfoFormRef, setRoleInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ role: UpdateRoleInput }>({ role: {} });
  const [createRoleMutate, createRoleMutation] = useMutation<{ createRole: Role }>(CREATE_ROLE, {
    variables: submitVariables,
    onCompleted({ createRole }) {
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
      ...{ role: submitData },
    });
    await createRoleMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={createRoleMutation.loading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {createRoleMutation.error ? <ErrorCard error={createRoleMutation.error} /> : null}

      <RoleInfoForm wrappedComponentRef={(inst: unknown) => setRoleInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createRoleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
