import React, { forwardRef } from 'react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

interface IProps extends SwitchProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
}

export const AttachmentBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  return <p>AttachmentBox</p>;
});
