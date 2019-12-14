import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Role } from '@leaa/common/src/entrys';
import { CreateRoleInput } from '@leaa/common/src/dtos/role';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_ROLE } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { RoleInfoForm } from '../_components/RoleInfoForm/RoleInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [roleInfoFormRef, setRoleInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ role: CreateRoleInput }>();
  const [createRoleMutate, createRoleMutation] = useMutation<{ createRole: Role }>(CREATE_ROLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createRole }) {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push(`/roles/${createRole.id}`);
    },
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: CreateRoleInput = {} as CreateRoleInput;

    roleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateRoleInput) => {
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
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={createRoleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <RoleInfoForm wrappedComponentRef={(inst: unknown) => setRoleInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createRoleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
