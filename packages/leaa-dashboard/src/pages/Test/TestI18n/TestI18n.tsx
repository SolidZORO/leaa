import moment from 'moment';
import React, { useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/react-hooks';

import { IPage } from '@leaa/dashboard/src/interfaces';
import { HtmlMeta } from '@leaa/dashboard/src/components';

import gql from 'graphql-tag';
import { successMessage } from '@leaa/dashboard/src/utils';

export const GET_TESTI18N = gql`
  query($x: Int) {
    testI18n(x: $x)
  }
`;

export default (props: IPage) => {
  const { t } = useTranslation();

  const [getTestI18nQuery, getTestI18nResult] = useLazyQuery<{ testI18n: string }, { x: number }>(GET_TESTI18N, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (getTestI18nResult.data?.testI18n) {
      successMessage(getTestI18nResult.data?.testI18n);
    }
  }, [getTestI18nResult.data]);

  // console.log(getTestI18nQuery);

  return (
    <>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />
      <h2>i18n</h2>
      <p>: p</p>
      <DatePicker showTime value={moment('2019-10-17T05:40:36.000Z')} />
      <br />
      <br />
      <Button type="primary" onClick={() => getTestI18nQuery()}>
        {t('_page:Test.getApiMessage')}
      </Button>{' '}
      <Button type="primary" onClick={() => getTestI18nQuery({ variables: { x: 2 } })}>
        {t('_page:Test.getApiError')}
      </Button>
    </>
  );
};
