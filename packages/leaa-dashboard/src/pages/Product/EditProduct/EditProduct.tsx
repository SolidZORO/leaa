import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Product, Tag } from '@leaa/common/src/entrys';
import { GET_PRODUCT, UPDATE_PRODUCT } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ProductArgs, UpdateProductInput } from '@leaa/common/src/dtos/product';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, SelectTagId, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { ProductInfoForm } from '../_components/ProductInfoForm/ProductInfoForm';
import { ProductImage } from '../_components/ProductImage/ProductImage';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateProductInput>>(null);
  const imageRef = useRef<{ onUpdateAllAttachments: () => void }>(null);

  const [productTags, setProductTags] = useState<Tag[]>();

  // query
  const getProductVariables = { id: Number(id) };
  const getProductQuery = useQuery<{ product: Product }, ProductArgs>(GET_PRODUCT, {
    variables: getProductVariables,
    fetchPolicy: 'network-only',
    onCompleted: data => !data.product && props.history.push('/products'),
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; product: UpdateProductInput }>();
  const [updateProductMutate, updateProductMutation] = useMutation<Product>(UPDATE_PRODUCT, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgUtil.message(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_PRODUCT, variables: getProductVariables }],
  });

  const onSubmit = async () => {
    const submitData: ISubmitData<UpdateProductInput> = await infoFormRef.current?.onValidateForm();

    if (!submitData) return;

    submitData.tagIds = productTags?.length ? productTags.map(item => Number(item.id)) : null;

    await setSubmitVariables({ id: Number(id), product: submitData });
    await updateProductMutate();

    await imageRef.current?.onUpdateAllAttachments();
  };

  const onChangeSelectedTagsCallback = (tags: Tag[]) => setProductTags(tags);

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={getProductQuery.loading || updateProductMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ProductInfoForm ref={infoFormRef} item={getProductQuery.data?.product} />
      <ProductImage item={getProductQuery.data?.product} ref={imageRef} />

      <div className={style['select-tag-id-wrapper']}>
        <SelectTagId
          placement="topLeft"
          enterCreateTag
          selectedTagsMaxLength={5}
          selectedTags={getProductQuery.data?.product?.tags}
          onChangeSelectedTagsCallback={onChangeSelectedTagsCallback}
        />
      </div>

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateProductMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
