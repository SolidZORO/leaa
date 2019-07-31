import React from 'react';
import { Helmet } from 'react-helmet';
import { envConfig } from '@leaa/dashboard/configs';
// import { useTranslation } from 'react-i18next';

interface IProps {
  title?: React.ReactNode;
  disableSiteName?: boolean;
}

export const HtmlTitle = (props: IProps) => {
  const siteName = props.disableSiteName ? '' : ` - ${envConfig.SITE_NAME}`;

  return (
    <Helmet>
      <title>
        {props.title}
        {siteName}
      </title>
    </Helmet>
  );
};
