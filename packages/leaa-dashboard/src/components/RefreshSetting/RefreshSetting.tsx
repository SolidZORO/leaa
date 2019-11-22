import React from 'react';
import { settingUtil } from '@leaa/dashboard/src/utils';

interface IProps {
  children: React.ReactNode;
}

export const RefreshSetting = (props: IProps) => {
  settingUtil.refreshLocalStorageSettings();

  return <>{props.children}</>;
};
