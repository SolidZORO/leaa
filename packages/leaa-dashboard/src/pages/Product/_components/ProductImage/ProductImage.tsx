import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';

import { Product } from '@leaa/common/src/entrys';

import { AttachmentBox, FormCard } from '@leaa/dashboard/src/components';

import { IAttachmentBoxRef } from '@leaa/common/src/interfaces/attachment.interface';

import style from './style.module.less';

interface IProps {
  item: Product;
  className?: string;
  loading?: boolean;
}

export const ProductImage = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const productImageRef = useRef<any>(null);

  const getBannerMbRef = useRef<IAttachmentBoxRef>(null);
  const getGallerMbRef = useRef<IAttachmentBoxRef>(null);

  // useImperativeHandle<{}, any>(
  //   ref,
  //   () => ({
  //     getGallerMbRef,
  //   }),
  //   [],
  // );

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:Product.Component.productImage')}>
        <Row gutter={16} className={style['form-row']} ref={productImageRef}>
          <Col xs={24} sm={8}>
            <AttachmentBox
              type="card"
              title={t('_page:Product.Component.bannerMb')}
              disableMessage
              ref={getBannerMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                typeName: 'banner',
                typePlatform: 'mb',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_page:Product.Component.galleryMb')}
              disableMessage
              ref={getGallerMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                typeName: 'gallery',
                typePlatform: 'mb',
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={8}>
            <AttachmentBox
              type="card"
              title={t('_page:Product.Component.bannerPc')}
              disableMessage
              // ref={getBannerMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                typeName: 'banner',
                typePlatform: 'pc',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_page:Product.Component.galleryPc')}
              disableMessage
              // ref={getBannerMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                typeName: 'gallery',
                typePlatform: 'pc',
              }}
            />
          </Col>
        </Row>
      </FormCard>
    </div>
  );
});
