import React from 'react';
import Head from 'next/head';

import { useStore } from '@leaa/www/stores';

interface IProps {
  title: React.ReactNode;
  description?: string;
  keywords?: string;
  disableSiteName?: boolean;
}

export const HtmlMeta = (props: IProps) => {
  const store = useStore();

  const settingSiteName = store && store.setting && store.setting.globalSettings.find(s => s.slug === 'site_name');

  let storeSiteName = 'NOT-SITE-NAME';

  if (settingSiteName && settingSiteName.value) {
    storeSiteName = settingSiteName.value;
  }

  const siteName = props.disableSiteName ? '' : ` xxxxx- ${storeSiteName}`;

  return (
    <Head>
      <>
        <title>
          {props.title}
          {siteName}
        </title>

        {props.description && <meta name="description" content={props.description} />}
        {props.keywords && <meta name="keywords" content={props.keywords} />}
      </>
    </Head>
  );
};
