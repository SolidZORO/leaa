import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

import { envConfig } from '@leaa/www/src/configs';

export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="renderer" content="webkit" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {envConfig.MODE === 'production' && envConfig.ANALYTICS_CODE && (
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: envConfig.ANALYTICS_CODE }}
            />
          )}
        </body>
      </html>
    );
  }
}
