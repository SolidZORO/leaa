import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { PageCard, HtmlMeta } from '@leaa/dashboard/src/components';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <PageCard route={props.route} title="@LIST" loading={false}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <div className="g-card--shadow">
        <span>N/A</span>
      </div>
    </PageCard>
  );
};
