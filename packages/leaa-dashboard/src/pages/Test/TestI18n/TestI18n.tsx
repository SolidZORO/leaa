import React from 'react';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/interfaces';
import { HtmlMeta } from '@leaa/dashboard/components/HtmlMeta';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <>
      <SuspenseFallback />
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <h2>i18n</h2>
      <p>: p</p>

      <DatePicker />
    </>
  );
};
