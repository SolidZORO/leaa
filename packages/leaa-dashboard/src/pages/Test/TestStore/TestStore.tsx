import React from 'react';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/interfaces';
import { useStore } from '@leaa/dashboard/stores';
import { HtmlMeta } from '@leaa/dashboard/components/HtmlMeta';

export default (props: IPage) => {
  const { t } = useTranslation();

  const store = useStore();
  store.mapping.abcMapping = ['AAAAAAAAAAAAAAAAAA'];

  return (
    <div>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <h2>STORE</h2>
      <div>{JSON.stringify(store)}</div>
    </div>
  );
};
