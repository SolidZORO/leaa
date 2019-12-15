import React from 'react';
import Link from 'next/link';

import { Rcon } from '@leaa/www/src/components';

import style from './style.less';

export const LayoutSimpleFooter = () => (
  <div className={style['full-layout-simple-footer']}>
    <div className="g-full-container">
      <div className={style['logo-row']}>
        <div className={style['logo-col']}>
          <div className={style['logo-image']}>
            <img src="/static/images/logo/logo-black.svg" alt="" />
          </div>

          <div className={style['copyright']}>
            <span>Copyright</span> © 2019 Leaa. All rights reserved.
          </div>
        </div>

        <div className={style['link-col']}>
          <div className={style['link-item']}>
            <Link href="https://github.com/SolidZORO/leaa" prefetch={false}>
              <a className={style['link']} target="_blank">
                <Rcon type="ri-github-fill" />
              </a>
            </Link>
          </div>

          <div className={style['link-item']}>
            <Link href="https://twitter.com/SolidZORO" prefetch={false}>
              <a className={style['link']} target="_blank">
                <Rcon type="ri-twitter-fill" />
              </a>
            </Link>
          </div>

          <div className={style['link-item']}>
            <Link href="https://www.instagram.com/solidzoro/" prefetch={false}>
              <a className={style['link']} target="_blank">
                <Rcon type="ri-instagram-line" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
