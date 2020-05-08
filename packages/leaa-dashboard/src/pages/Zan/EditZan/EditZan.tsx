import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Zan } from '@leaa/common/src/entrys';
import { GET_ZAN, UPDATE_ZAN } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ZanArgs, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { successMessage } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ZanInfoForm } from '../_components/ZanInfoForm/ZanInfoForm';
import { ZanUsersForm } from '../_components/ZanUsersForm/ZanUsersForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateZanInput>>(null);

  // query
  const getZanVariables = { id };
  const getZanQuery = useQuery<{ zan: Zan }, ZanArgs>(GET_ZAN, {
    variables: getZanVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id?: string | null; zan: UpdateZanInput }>();
  const [updateZanMutate, updateZanMutation] = useMutation<Zan>(UPDATE_ZAN, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => successMessage(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ZAN, variables: getZanVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateZanInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateZanInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id: getZanQuery?.data?.zan?.id, zan: submitData });
    await updateZanMutate();
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
      loading={getZanQuery.loading || updateZanMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ZanInfoForm ref={infoFormRef} item={getZanQuery.data?.zan} loading={getZanQuery.loading} />

      <ZanUsersForm item={getZanQuery.data?.zan} loading={getZanQuery.loading} />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateZanMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
