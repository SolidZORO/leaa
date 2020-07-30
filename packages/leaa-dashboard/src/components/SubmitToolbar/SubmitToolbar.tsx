import React, { useState } from 'react';
import cx from 'classnames';
import { Button, Affix } from 'antd';

import { CREATE_BUTTON_ICON, UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { useTranslation } from 'react-i18next';

import { RiMoreFill } from './icons';
import style from './style.module.less';

interface IProps {
  buttonGroup?: React.ReactNode;
  moreGroup?: React.ReactNode;
  // children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  loading?: boolean;
  theme?: 'dark' | 'light';
  onAction?: () => void;
  simpleButtonGroup?: { title: '@CREATE' | '@UPDATE'; loading: boolean };
  simpleButtonAction?: () => void;
}

// TODO, add a more menu
export const SubmitToolbar = (props: IProps) => {
  const { t } = useTranslation();

  const [isAffix, setIsAffix] = useState(false);

  let buttonGroup = null;

  if (props.simpleButtonGroup?.title === '@CREATE') {
    buttonGroup = (
      <Button
        className={style['button--create']}
        size="large"
        type="link"
        icon={CREATE_BUTTON_ICON}
        loading={props.loading}
        onClick={props.simpleButtonAction}
      >
        {t('_lang:create')}
      </Button>
    );
  }

  if (props.simpleButtonGroup?.title === '@UPDATE') {
    buttonGroup = (
      <Button
        className={style['button--update']}
        size="large"
        type="link"
        icon={UPDATE_BUTTON_ICON}
        loading={props.loading}
        onClick={props.simpleButtonAction}
      >
        {t('_lang:update')}
      </Button>
    );
  }

  if (props.buttonGroup) {
    buttonGroup = props.buttonGroup;
  }

  return (
    <Affix offsetBottom={0} onChange={(e) => setIsAffix(Boolean(e))}>
      <div
        className={cx(
          style['submit-toolbar-comp-wrapper'],
          style[`submit-toolbar-comp-wrapper--${props.theme}`],
          props.className,
          {
            [style['submit-toolbar-comp-wrapper--notAffix']]: !isAffix,
          },
        )}
      >
        <div className={style['submit-toolbar-container']}>
          <div className={style['submit-toolbar-buttonGroup']}>{buttonGroup}</div>

          {props.moreGroup && (
            <div className={style['submit-toolbar-moreGroup']}>
              <Button type="link" icon={<RiMoreFill />} />
            </div>
          )}
        </div>
      </div>
    </Affix>
  );
};
