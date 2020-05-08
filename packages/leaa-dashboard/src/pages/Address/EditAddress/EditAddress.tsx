import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Address } from '@leaa/common/src/entrys';
import { GET_ADDRESS, UPDATE_ADDRESS } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AddressArgs, UpdateAddressInput } from '@leaa/common/src/dtos/address';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { AddressInfoForm } from '../_components/AddressInfoForm/AddressInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateAddressInput>>(null);

  // query
  const getAddressVariables = { id };
  const getAddressQuery = useQuery<{ address: Address }, AddressArgs>(GET_ADDRESS, {
    variables: getAddressVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; address: UpdateAddressInput }>({
    id,
    address: {},
  });
  const [updateAddressMutate, updateAddressMutation] = useMutation<Address>(UPDATE_ADDRESS, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgMessage(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ADDRESS, variables: getAddressVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateAddressInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    // @ts-ignore
    delete infoData.addressSelect;

    const submitData: ISubmitData<UpdateAddressInput> = infoData;

    await setSubmitVariables({ id, address: submitData });
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

      <AddressInfoForm ref={infoFormRef} item={getAddressQuery.data?.address} loading={getAddressQuery.loading} />

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
