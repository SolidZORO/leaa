import React from 'react';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, BuildInfo, FilterIcon, SearchInput, TableCard, PageCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <PageCard route={props.route} title="@LIST" loading={false}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <BuildInfo className={style['build-info']} />
    </PageCard>
  );
};
