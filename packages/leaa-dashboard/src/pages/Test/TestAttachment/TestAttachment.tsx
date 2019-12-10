import React, { useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';

import { HtmlMeta, AttachmentBox } from '@leaa/dashboard/src/components';

export default (props: IPage) => {
  const { t } = useTranslation();

  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);

  const onSubmitAttachmentBox = () => {
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }
  };

  return (
    <div>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <h2>Attachment Box</h2>

      <AttachmentBox
        ref={attachmentBoxRef}
        attachmentParams={{
          type: 'image',
          moduleId: 9,
          moduleName: 'playground',
          typeName: 'testbox',
          typePlatform: 'mb',
        }}
        listHeight={200}
      />

      <br />

      <Button type="primary" size="large" onClick={onSubmitAttachmentBox}>
        Submit Attachments
      </Button>
    </div>
  );
};
