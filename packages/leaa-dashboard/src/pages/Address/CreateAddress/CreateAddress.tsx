import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Address } from '@leaa/common/src/entrys';
import { CreateAddressInput } from '@leaa/common/src/dtos/address';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_ADDRESS } from '@leaa/dashboard/src/graphqls';
import { msgUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { AddressInfoForm } from '../_components/AddressInfoForm/AddressInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateAddressInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ address: CreateAddressInput }>();
  const [createAddressMutate, createAddressMutation] = useMutation<{ createAddress: Address }>(CREATE_ADDRESS, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createAddress }) {
      msgUtil.message(t('_lang:createdSuccessfully'));
      props.history.push(`/addresses/${createAddress.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateAddressInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    // @ts-ignore
    delete infoData.addressSelect;

    const submitData: ISubmitData<CreateAddressInput> = infoData;

    await setSubmitVariables({ address: submitData });
    await createAddressMutate();
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
      loading={createAddressMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <AddressInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createAddressMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
