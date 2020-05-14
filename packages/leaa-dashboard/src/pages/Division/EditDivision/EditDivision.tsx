import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Division } from '@leaa/common/src/entrys';
import { GET_DIVISION, UPDATE_DIVISION } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { DivisionArgs, UpdateDivisionInput } from '@leaa/common/src/dtos/division';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msg } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { DivisionInfoForm } from '../_components/DivisionInfoForm/DivisionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateDivisionInput>>(null);

  // query
  const getDivisionVariables = { id };
  const getDivisionQuery = useQuery<{ division: Division }, DivisionArgs>(GET_DIVISION, {
    variables: getDivisionVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; division: UpdateDivisionInput }>({
    id,
    division: {},
  });
  const [updateDivisionMutate, updateDivisionMutation] = useMutation<Division>(UPDATE_DIVISION, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_DIVISION, variables: getDivisionVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateDivisionInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateDivisionInput> = infoData;

    await setSubmitVariables({ id, division: submitData });
    await updateDivisionMutate();
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
      loading={getDivisionQuery.loading || updateDivisionMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <DivisionInfoForm ref={infoFormRef} item={getDivisionQuery.data?.division} loading={getDivisionQuery.loading} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateDivisionMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
