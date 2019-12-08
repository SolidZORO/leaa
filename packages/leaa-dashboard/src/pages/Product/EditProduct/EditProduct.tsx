import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Product, Tag } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_PRODUCT, UPDATE_PRODUCT } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ProductArgs, UpdateProductInput } from '@leaa/common/src/dtos/product';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, SelectTagId, SubmitBar } from '@leaa/dashboard/src/components';

import { ProductInfoForm } from '../_components/ProductInfoForm/ProductInfoForm';
import { ProductImage } from '../_components/ProductImage/ProductImage';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const selectTagIdRef = useRef<any>(null);
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  const productContentRef = useRef<any>(null);
  const [productInfoFormRef, setProductInfoFormRef] = useState<any>();
  const [productTags, setProductTags] = useState<Tag[]>();

  // query
  const getProductVariables = { id: Number(id) };
  const getProductQuery = useQuery<{ product: Product }, ProductArgs>(GET_PRODUCT, {
    variables: getProductVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; product: UpdateProductInput }>();
  const [updateProductMutate, updateProductMutation] = useMutation<Product>(UPDATE_PRODUCT, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PRODUCT, variables: getProductVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateProductInput = {};

    // info
    productInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Product) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;
    });

    if (hasError) {
      return;
    }

    if (hasError) {
      return;
    }

    if (
      productContentRef &&
      productContentRef.current &&
      productContentRef.current.getInstance() &&
      productContentRef.current.getInstance().getHtml() &&
      typeof productContentRef.current.getInstance().getHtml() !== 'undefined'
    ) {
      submitData.content = productContentRef.current.getInstance().getHtml();
    }

    submitData.tagIds = productTags && productTags.length > 0 ? productTags.map(item => Number(item.id)) : undefined;

    await setSubmitVariables({ id: Number(id), product: submitData });
    await updateProductMutate();

    // attachment box
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }

    // keep form fields consistent with API
    productInfoFormRef.props.form.resetFields();
  };

  const onChangeSelectedTagsCallback = (tags: Tag[]) => {
    setProductTags(tags);
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
      loading={getProductQuery.loading || updateProductMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ProductInfoForm
        item={getProductQuery.data && getProductQuery.data.product}
        loading={getProductQuery.loading}
        wrappedComponentRef={(inst: unknown) => setProductInfoFormRef(inst)}
      />

      {getProductQuery.data && getProductQuery.data.product && <ProductImage item={getProductQuery.data.product} />}

      <div className={style['select-tag-id-wrapper']}>
        <SelectTagId
          ref={selectTagIdRef}
          placement="topLeft"
          enterCreateTag
          selectedTagsMaxLength={5}
          selectedTags={getProductQuery.data && getProductQuery.data.product && getProductQuery.data.product.tags}
          onChangeSelectedTagsCallback={onChangeSelectedTagsCallback}
        />
      </div>

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateProductMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
