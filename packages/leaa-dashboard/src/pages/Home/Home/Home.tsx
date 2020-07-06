import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, BuildInfo, PageCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <PageCard route={props.route} title="@LIST" loading={false}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <BuildInfo className={cx(style['build-info'], 'g-card--shadow')} />
    </PageCard>
  );
};
