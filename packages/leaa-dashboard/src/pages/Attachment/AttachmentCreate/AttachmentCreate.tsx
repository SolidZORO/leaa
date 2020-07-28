import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { PageCard, HtmlMeta, AttachmentBox } from '@leaa/dashboard/src/components';

import style from './style.module.less';

// const API_PATH = 'attachments';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={false}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <AttachmentBox
        type="list"
        title="TEST"
        listHeight={350}
        attachmentParams={{
          type: 'image',
          moduleName: 'attachment',
          typeName: 'demo',
        }}
      />
    </PageCard>
  );
};
