import React from 'react';
import { Icon } from 'antd';
import Link from 'next/link';

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
                <Icon type="github" />
              </a>
            </Link>
          </div>

          <div className={style['link-item']}>
            <Link href="https://twitter.com/SolidZORO" prefetch={false}>
              <a className={style['link']} target="_blank">
                <Icon type="twitter" />
              </a>
            </Link>
          </div>

          <div className={style['link-item']}>
            <Link href="https://www.instagram.com/solidzoro/" prefetch={false}>
              <a className={style['link']} target="_blank">
                <Icon type="instagram" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
