import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';

import { Product } from '@leaa/common/src/entrys';

import { AttachmentBox, FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item: Product;
  className?: string;
  loading?: boolean;
}

export const ProductImage = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:Product.Component.productImage')}>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={8}>
            <AttachmentBox
              type="card"
              title={t('_page:Product.Component.bannerMb')}
              disableMessage
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
};
