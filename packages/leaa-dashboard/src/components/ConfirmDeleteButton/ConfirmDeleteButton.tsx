import React, { useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

import style from './style.module.less';

interface IProps extends ButtonProps {
  title?: string;
  opacity?: number;
}

export const ConfirmDeleteButton = (props: IProps) => {
  const { t } = useTranslation();

  const [confirm, setConfirm] = useState<boolean>(false);

  return (
    <div className={props.className}>
      <Tooltip
        title={props.title || <span>{t('_comp:ConfirmDeleteButton.confirmDeleteMessage')}</span>}
        visible={confirm}
        mouseLeaveDelay={0.5}
        overlayClassName={style['delete-tooltip-wrapper']}
        onVisibleChange={e => !e && setConfirm(false)}
      >
        <Button
          type={props.type || 'link'}
          size={props.size || 'small'}
          shape={props.shape || 'circle'}
          icon={props.icon || <DeleteOutlined />}
          {...props}
          className={cx(style['delete'], { [style['delete-need--confirm']]: confirm })}
          style={{ ...props.style, opacity: props.opacity }}
          onClick={confirm ? props.onClick : () => setConfirm(true)}
        />
      </Tooltip>
    </div>
  );
};
