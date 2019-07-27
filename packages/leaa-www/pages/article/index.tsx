import React from 'react';
import { Link, withTranslation } from '@leaa/www/i18n';

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
  </>
);

nPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default withTranslation()(nPage);
