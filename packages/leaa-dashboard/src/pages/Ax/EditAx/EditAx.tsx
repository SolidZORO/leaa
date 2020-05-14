import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/src/entrys';
import { GET_AX, UPDATE_AX } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AxArgs, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msg } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';
import { AxImage } from '../_components/AxImage/AxImage';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateAxInput>>(null);
  const imageRef = useRef<{ onUpdateAllAttachments: () => void }>(null);

  // query
  const getAxVariables = { id };
  const getAxQuery = useQuery<{ ax: Ax }, AxArgs>(GET_AX, {
    variables: getAxVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; ax: UpdateAxInput }>();
  const [updateAxMutate, updateAxMutation] = useMutation<Ax>(UPDATE_AX, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_AX, variables: getAxVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateAxInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateAxInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id, ax: submitData });
    await updateAxMutate();

    // attachments
    await imageRef.current?.onUpdateAllAttachments();
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
      loading={getAxQuery.loading || updateAxMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <AxInfoForm ref={infoFormRef} item={getAxQuery.data?.ax} loading={getAxQuery.loading} />

      <AxImage ref={imageRef} item={getAxQuery.data?.ax} />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateAxMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
