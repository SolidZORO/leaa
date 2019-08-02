import React from 'react';
import cx from 'classnames';
import { Icon, Button } from 'antd';

import style from './style.less';

interface IProps {
  onCallbackSidebarTarget?: () => void;
  className?: string;
  collapsed?: boolean;
}

export const SidebarTarget = (props: IProps): JSX.Element => {
  return (
    <div
      className={cx(style['wrapper'], {
        [style['wrapper--collapsed']]: props.collapsed,
      })}
    >
      <Button type="link" onClick={props.onCallbackSidebarTarget}>
        {props.collapsed ? <Icon type="menu-unfold" /> : <Icon type="menu-fold" />}
      </Button>
    </div>
  );
};
