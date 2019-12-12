import cx from 'classnames';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';

import { Ax } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { AttachmentBox, FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Ax;
  className?: string;
  loading?: boolean;
}

export const AxImage = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const bannerMbRef = useRef<IAttachmentBoxRef>(null);
  const galleryMbRef = useRef<IAttachmentBoxRef>(null);
  //
  const bannerPcRef = useRef<IAttachmentBoxRef>(null);
  const galleryPcRef = useRef<IAttachmentBoxRef>(null);

  const onUpdateAllAttachments = () => {
    bannerMbRef.current?.onUpdateAttachments();
    galleryMbRef.current?.onUpdateAttachments();
    //
    bannerPcRef.current?.onUpdateAttachments();
    galleryPcRef.current?.onUpdateAttachments();
  };

  useImperativeHandle<{}, any>(ref, () => ({ onUpdateAllAttachments }), []);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:Ax.axImage')}>
        <Row gutter={16} className={style['form-row']} ref={ref}>
          <Col xs={24} sm={8}>
            <AttachmentBox
              type="card"
              title={t('_lang:bannerMb')}
              disableMessage
              ref={bannerMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item?.id),
                moduleName: 'ax',
                typeName: 'banner',
                typePlatform: 'mb',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_lang:galleryMb')}
              disableMessage
              ref={galleryMbRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item?.id),
                moduleName: 'ax',
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
              title={t('_lang:bannerPc')}
              disableMessage
              ref={bannerPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item?.id),
                moduleName: 'ax',
                typeName: 'banner',
                typePlatform: 'pc',
              }}
            />
          </Col>

          <Col xs={24} sm={16}>
            <AttachmentBox
              type="list"
              title={t('_lang:galleryPc')}
              disableMessage
              ref={galleryPcRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(props.item?.id),
                moduleName: 'ax',
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
