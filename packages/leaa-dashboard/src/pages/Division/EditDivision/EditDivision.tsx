import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Address } from '@leaa/common/src/entrys';
import { GET_ADDRESS, UPDATE_ADDRESS } from '@leaa/dashboard/src/graphqls';
import { RolesWithPaginationObject, RolesArgs } from '@leaa/common/src/dtos/role';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AddressArgs, UpdateAddressInput } from '@leaa/common/src/dtos/address';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { DivisionInfoForm } from '../_components/DivisionInfoForm/DivisionInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateAddressInput>>(null);

  // query
  const getAddressVariables = { id: Number(id) };
  const getAddressQuery = useQuery<{ address: Address }, AddressArgs>(GET_ADDRESS, {
    variables: getAddressVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; address: UpdateAddressInput }>({
    id: Number(id),
    address: {},
  });
  const [updateAddressMutate, updateAddressMutation] = useMutation<Address>(UPDATE_ADDRESS, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlSuccess(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ADDRESS, variables: getAddressVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateAddressInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateAddressInput> = infoData;

    await setSubmitVariables({ id: Number(id), address: submitData });
    await updateAddressMutate();
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
      loading={getAddressQuery.loading || updateAddressMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <DivisionInfoForm ref={infoFormRef} item={getAddressQuery.data?.address} loading={getAddressQuery.loading} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateAddressMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
