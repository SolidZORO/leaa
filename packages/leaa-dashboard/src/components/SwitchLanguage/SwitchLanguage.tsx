import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation, Trans } from 'react-i18next';

import style from './style.less';

export const SwitchLanguage = (): JSX.Element => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  return (
    <div className={style['wrapper']}>
      <Button onClick={() => changeLanguage('cn')}>CN</Button>
      <Button onClick={() => changeLanguage('en')}>EN</Button>
    </div>
  );
};
