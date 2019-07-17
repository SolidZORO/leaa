import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { Spin, Icon, LocaleProvider } from 'antd';

// <link rel="stylesheet" href="/static/libs/nprogress/nprogress.css" />
// Antd Component Indicator Reset
Spin.setDefaultIndicator(<Icon type="loading" spin={true} />);

export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
