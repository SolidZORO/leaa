import React, { useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';

import { Product } from '@leaa/common/src/entrys';

import { AttachmentBox, FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import { IAttachmentBoxRef } from '@leaa/common/src/interfaces/attachment.interface';

import style from './style.module.less';

interface IProps {
  item: Product;
  className?: string;
  loading?: boolean;
}

export const ProductImage = (props: IProps) => {
  const { t } = useTranslation();

  const getBannerPcRef = useRef<IAttachmentBoxRef>(null);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:Product.Component.productImage')}>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={8}>
            <AttachmentBox
              type="card"
              title={t('_page:Product.Component.bannerMb')}
              disableMessage
              ref={getBannerPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                moduleType: 'banner_mb',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_page:Product.Component.galleryMb')}
              disableMessage
              ref={getBannerPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                moduleType: 'gallery_mb',
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
              ref={getBannerPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                moduleType: 'banner_pc',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_page:Product.Component.galleryPc')}
              disableMessage
              ref={getBannerPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item.id),
                moduleName: 'product',
                moduleType: 'gallery_pc',
              }}
            />
          </Col>
        </Row>
      </FormCard>
    </div>
  );
};
