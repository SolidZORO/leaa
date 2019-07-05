import React from 'react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

interface IProps extends SwitchProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
}

export class SwitchNumber extends React.PureComponent<IProps> {
  render() {
    return <Switch checked={Boolean(this.props.value)} onChange={this.props.onChange} {...this.props} />;
  }
}
