import React from 'react';
import cx from 'classnames';
import { Button, Popover } from 'antd';

import { RiMoreFill } from './icons';

import style from './style.module.less';

interface IProps {
  buttonGroup: React.ReactNode;
  moreGroup: React.ReactNode;
  // children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  loading?: boolean;
  full?: boolean;
}

export const SubmitToolbar = (props: IProps) => (
  <div className={cx(style['submit-toolbar-wrapper'], props.className)}>
    <div className={style['submit-toolbar-container']}>
      {props.buttonGroup && <div className={style['submit-toolbar-buttonGroup']}>{props.buttonGroup}</div>}

      {props.moreGroup && (
        <div className={style['submit-toolbar-moreGroup']}>
          <Button type="link" icon={<RiMoreFill />} />
        </div>
      )}
    </div>
  </div>
);
