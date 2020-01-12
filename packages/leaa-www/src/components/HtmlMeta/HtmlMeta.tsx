import React from 'react';
import Head from 'next/head';

import { useStore } from '@leaa/www/src/stores';

interface IProps {
  title: React.ReactNode;
  description?: string;
  keywords?: string;
  disableSiteName?: boolean;
}

const cutTextLength = (rawText: string, cutLength = 140): string => {
  let result = rawText;

  if (rawText) {
    const resultMatchs = rawText.substring(0, cutLength).match(/.*[.|。]/);

    if (resultMatchs === null) {
      result = rawText.substring(0, cutLength);
    } else if (resultMatchs) {
      // eslint-disable-next-line prefer-destructuring
      result = resultMatchs[0];
    }
  }

  return result;
};

export const HtmlMeta = (props: IProps) => {
  const store = useStore();

  const settingSiteName = store?.setting?.globalSettings.find(s => s.slug === 'site_name');

  let storeSiteName = 'NOT-SITE-NAME';

  if (settingSiteName?.value) {
    storeSiteName = settingSiteName.value;
  }

  const siteName = props.disableSiteName ? '' : ` - ${storeSiteName}`;

  let description = '';

  if (props.description) {
    description = cutTextLength(props.description);
  }

  return (
    <Head>
      <title>
        {props.title}
        {siteName}
      </title>

      <meta name="description" content={description || storeSiteName} />
      <meta name="keywords" content={props.keywords || storeSiteName} />
    </Head>
  );
};
