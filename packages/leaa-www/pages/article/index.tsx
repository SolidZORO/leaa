import React from 'react';
// import Link from 'next/link';
import getConfig from 'next/config';

import { IPage } from '@leaa/www/interfaces';
import { i18n, Link, withTranslation } from '@leaa/www/i18n';

// export default () => <p>Blog</p>;
const { publicRuntimeConfig } = getConfig();

const nPage = ({ t }: any) => (
  <>
    <Link href="/blog">
      <a>- BLOG -</a>
    </Link>
    <Link href="/article">
      <a>- ARTICLE -</a>
    </Link>
    <br />
    <h1>ARTICLE</h1>
    <h2> {t('common:h1')}</h2>
    {JSON.stringify(publicRuntimeConfig)}
  </>
);

nPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default withTranslation()(nPage);
