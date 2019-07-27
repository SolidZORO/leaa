import React from 'react';
// import Link from 'next/link';

import { IPage } from '@leaa/www/interfaces';
import { i18n, Link, withTranslation } from '@leaa/www/i18n';

// export default () => <p>Blog</p>;
const nPage = (k: any) => {
  return (
    <>
      <Link href="/blog">
        <a>- BLOG -</a>
      </Link>
      <Link href="/article">
        <a>- ARTICLExxxxxxxxxxxxxx -</a>
      </Link>
      <br />
      <h1>BLOG</h1>
      <h2> {k.t('common:to-second-page')}</h2>
    </>
  );
};

nPage.getInitialProps = async () => ({});

export default withTranslation()(nPage);
