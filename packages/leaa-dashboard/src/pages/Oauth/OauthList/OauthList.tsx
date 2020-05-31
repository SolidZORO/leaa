import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPage } from '@leaa/dashboard/src/interfaces';

export default (props: IPage) => {
  const { t } = useTranslation();

  return <p>N/A</p>;
};
