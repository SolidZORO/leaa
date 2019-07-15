import React, { useRef } from 'react';
import { DatePicker, Button } from 'antd';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useStore } from '@leaa/dashboard/stores';
import { authUtil } from '@leaa/dashboard/utils';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';

export default (props: RouteComponentProps) => {
  const store = useStore();
  const attachmentBoxRef = useRef<{
    onUpdateAttachments: () => void;
  }>(null);

  store.mapping.abcMapping = ['aaaaaaa'];

  const onSubmitAttachmentBox = () => {
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }
  };

  return (
    <div>
      <h2>BOX</h2>
      <Button type="primary" size="large" onClick={onSubmitAttachmentBox}>
        Submit Attachments
      </Button>

      <AttachmentBox
        ref={attachmentBoxRef}
        attachmentParams={{
          type: 'image',
          moduleId: 9,
          moduleName: 'playground',
          moduleType: 'testbox',
        }}
      />

      <hr />
      <DatePicker />
      <Link to="/show/9">SHOW 9</Link>
      <hr />
      <Link to="/user-permissions/9">user-permissions 9</Link>

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
