import React from 'react';
import { useTranslation } from 'react-i18next';

import { IPage } from '@leaa/dashboard/interfaces';
import { HtmlTitle } from '@leaa/dashboard/components/HtmlTitle';

export default (props: IPage) => {
  const { t } = useTranslation();

  return (
    <div>
      <HtmlTitle title={t(`${props.route.namei18n}`)} />

      <h2>{t('_route:home')}</h2>

      <p>: &gt;</p>
    </div>
  );
};
