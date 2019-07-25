import React from 'react';
// import Link from 'next/link';

import { i18n, Link, withTranslation } from '@leaa/www/i18n';

// export default () => <p>Blog</p>;
export default withTranslation()(({ t }) => (
  <>
    <Link href="/blog">
      <a>- BLOG -</a>
    </Link>
    <Link href="/article">
      <a>- ARTICLE -</a>
    </Link>
    <br />
    <h1>BLOG</h1>
    <h2> {t('common:to-second-page')}</h2>
  </>
));
