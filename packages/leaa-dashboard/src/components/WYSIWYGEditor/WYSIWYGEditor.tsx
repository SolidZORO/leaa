/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cx from 'classnames';
import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from 'antd';

import { IAttachmentParams } from '@leaa/common/src/interfaces';

import style from './style.module.less';

interface IProps {
  attachmentParams: IAttachmentParams;
  content?: string;
  className?: string;
  onSave?: () => void;
  height?: () => number;
  onGetContent?: () => void;
}

export const WYSIWYGEditor = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [value, setValue] = useState<string>(props.content || '');

  useEffect(() => {
    if (props.content) setValue(props.content);
  }, [props.content]);

  const onChange = (e: any) => setValue(e.target.value);

  // TODO: here is missing a WYSIWYGEditor
  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Input.TextArea ref={ref} value={value} onChange={onChange} autoSize={{ minRows: 20, maxRows: 80 }} />
    </div>
  );
});
