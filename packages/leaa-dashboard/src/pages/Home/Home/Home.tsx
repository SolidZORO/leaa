import React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('_route:home')}</h2>

      <p>: &gt;</p>
    </div>
  );
};
