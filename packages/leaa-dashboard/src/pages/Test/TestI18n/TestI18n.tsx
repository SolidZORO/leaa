import moment from 'moment';
import React from 'react';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/src/interfaces';
import { HtmlMeta } from '@leaa/dashboard/src/components';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />
      <h2>i18n</h2>
      <p>: p</p>
      <DatePicker showTime value={moment('2019-10-17T05:40:36.000Z')} />
      <br />
      <br />
    </>
  );
};
