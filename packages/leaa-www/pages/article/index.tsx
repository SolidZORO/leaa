import React from 'react';
import Link from 'next/link';

// export default () => <p>Blog</p>;
export default () => (
  <>
    <Link href="/blog">
      <a>- BLOG -</a>
    </Link>
    <Link href="/article">
      <a>- ARTICLE -</a>
    </Link>
    <br />
    <h1>ARTICLE</h1>
  </>
);
