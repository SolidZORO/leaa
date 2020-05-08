import React from 'react';
import { refreshLocalStorageSettings } from '@leaa/dashboard/src/utils';

interface IProps {
  children: React.ReactNode;
}

export const RefreshSetting = (props: IProps) => {
  refreshLocalStorageSettings();

  return <>{props.children}</>;
};
