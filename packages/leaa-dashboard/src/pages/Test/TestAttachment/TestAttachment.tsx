import React, { useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/interfaces';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';
import { IAttachmentBoxRef } from '@leaa/common/interfaces';
import { HtmlMeta } from '@leaa/dashboard/components/HtmlMeta';

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
          moduleType: 'testbox',
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
