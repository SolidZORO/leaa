import React from 'react';
import { Row, Col } from 'antd';
import Link from 'next/link';

import { __MENU_MOCK__ } from '@leaa/www/src/__mock__';

import style from './style.less';

export const LayoutFooter = () => (
  <div className={style['full-layout-footer']}>
    <div className="g-full-container">
      <Row gutter={16} type="flex" className={style['menu-row']}>
        {__MENU_MOCK__.footerMenu.map(m => (
          <Col key={m.title}>
            <h2 className={style['menu-title']}>{m.title}</h2>
            <ul className={style['menu-list']}>
              {m.chlidren.map(mc => (
                <li key={mc.title} className={style['menu-item']}>
                  <Link href={mc.link} prefetch={false}>
                    <a className={style['link']}>{mc.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>

      <div className={style['logo-row']}>
        <div className={style['logo-image']}>
          <img src="/static/images/logo/logo-white.svg" alt="" />
        </div>

        <div className={style['copyright']}>Copyright © 2019 Leaa. All rights reserved.</div>
      </div>
    </div>
  </div>
);
