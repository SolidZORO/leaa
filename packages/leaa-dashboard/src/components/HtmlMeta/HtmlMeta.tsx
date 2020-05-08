import React from 'react';
// import { Helmet } from 'react-helmet';
import { envConfig } from '@leaa/dashboard/src/configs';
import { getLocalStorageSettings } from '@leaa/dashboard/src/utils';
import { Helmet } from 'react-helmet-async';

// import { useTranslation } from 'react-i18next';

interface IProps {
  title?: React.ReactNode;
  disableSiteName?: boolean;
}

export const HtmlMeta = (props: IProps) => {
  const siteName = props.disableSiteName
    ? ''
    : ` - ${getLocalStorageSettings({ key: 'site_name', disableNotification: true }).value || envConfig.SITE_NAME}`;

  return (
    <Helmet>
      <title>
        {props.title}
        {siteName}
      </title>
    </Helmet>
  );
};
