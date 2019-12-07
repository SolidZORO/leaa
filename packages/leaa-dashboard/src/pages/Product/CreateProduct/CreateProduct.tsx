import React, { useState } from 'react';
import { Button, Icon, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Product } from '@leaa/common/src/entrys';
import { CreateProductInput } from '@leaa/common/src/dtos/product';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_PRODUCT } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, SubmitBar } from '@leaa/dashboard/src/components';

import { ProductInfoForm } from '../_components/ProductInfoForm/ProductInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [productInfoFormRef, setProductInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ product: CreateProductInput }>();
  const [createProductMutate, createProductMutation] = useMutation<{ createProduct: Product }>(CREATE_PRODUCT, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createProduct }) {
      messageUtil.gqlCompleted(t('_lang:createdSuccessfully'));
      props.history.push(`/products/${createProduct.id}`);
    },
  });

  const onSubmit = async () => {
    productInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateProductInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ product: formData });
      await createProductMutate();
    });
  };

  return (
    <PageCard
      title={
        <span>
          <Icon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={createProductMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ProductInfoForm wrappedComponentRef={(inst: unknown) => setProductInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createProductMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
