import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import style from './style.module.less';

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
        {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  );
};
