import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'antd';

import { Product } from '@leaa/common/src/entrys';
import { CREATE_PRODUCT } from '@leaa/dashboard/src/graphqls';
import { CreateProductInput } from '@leaa/common/src/dtos/product';
import { IPage, ISubmitData, ICommenFormRef } from '@leaa/dashboard/src/interfaces';
import { msgUtil } from '@leaa/dashboard/src/utils';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PageCard, HtmlMeta, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { ProductInfoForm } from '../_components/ProductInfoForm/ProductInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateProductInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ product: CreateProductInput }>();
  const [createProductMutate, createProductMutation] = useMutation<{ createProduct: Product }>(CREATE_PRODUCT, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createProduct }) {
      msgUtil.message(t('_lang:createdSuccessfully'));
      props.history.push(`/products/${createProduct.id}`);
    },
  });

  const onSubmit = async () => {
    const submitData: ISubmitData<CreateProductInput> = await infoFormRef.current?.onValidateForm();

    if (!submitData) return;

    await setSubmitVariables({ product: submitData });
    await createProductMutate();
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
      loading={createProductMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ProductInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createProductMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
