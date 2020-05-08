import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Permission } from '@leaa/common/src/entrys';
import { CreatePermissionInput } from '@leaa/common/src/dtos/permission';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_PERMISSION } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { msgMessage } from '@leaa/dashboard/src/utils';
import { PageCard, SubmitBar, Rcon, HtmlMeta } from '@leaa/dashboard/src/components';

import { PermissionInfoForm } from '../_components/PermissionInfoForm/PermissionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreatePermissionInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ permission: CreatePermissionInput }>();
  const [createPermissionMutate, createPermissionMutation] = useMutation<{ createPermission: Permission }>(
    CREATE_PERMISSION,
    {
      variables: submitVariables,
      // apollo-link-error onError: e => messageUtil.gqlError(e.message),
      onCompleted({ createPermission }) {
        msgMessage(t('_lang:createdSuccessfully'));
        props.history.push(`/permissions/${createPermission.id}`);
      },
    },
  );

  const onSubmit = async () => {
    const infoData: ISubmitData<CreatePermissionInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreatePermissionInput> = {
      ...infoData,
    };

    await setSubmitVariables({ permission: submitData });
    await createPermissionMutate();
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
      loading={false}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <PermissionInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createPermissionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
