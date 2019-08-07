import React, { useRef } from 'react';
import { DatePicker, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/interfaces';
import { useStore } from '@leaa/dashboard/stores';
import { authUtil } from '@leaa/dashboard/utils';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';
import { IAttachmentBoxRef } from '@leaa/common/interfaces';
import { HtmlMeta } from '@leaa/dashboard/components/HtmlMeta';

export default (props: IPage) => {
  const { t } = useTranslation();

  const store = useStore();
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);

  store.mapping.abcMapping = ['aaaaaaa'];

  const onSubmitAttachmentBox = () => {
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }
  };

  return (
    <div>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <h2>BOX</h2>

      <AttachmentBox
        ref={attachmentBoxRef}
        attachmentParams={{
          type: 'image',
          moduleId: 9,
          moduleName: 'playground',
          moduleType: 'testbox',
        }}
      />

      <br />

      <Button type="primary" size="large" onClick={onSubmitAttachmentBox}>
        Submit Attachments
      </Button>

      <br />
      <br />

      <hr />

      <DatePicker />

      <h2>STORE</h2>
      <hr />
      <div>{JSON.stringify(store)}</div>

      <h2>LS AUTH</h2>
      <hr />
      <div>{JSON.stringify(authUtil.getAuthInfo())}</div>

      <h2>PROPS</h2>
      <hr />
      <div>{JSON.stringify(props.match)}</div>
    </div>
  );
};
