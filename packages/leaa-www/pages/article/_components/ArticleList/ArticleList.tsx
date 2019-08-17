import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import dayjs from 'dayjs';

import { ArticlesWithPaginationObject } from '@leaa/common/dtos/article';

import style from './style.less';

interface IProps {
  articles: ArticlesWithPaginationObject;
}

export default (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        {props.articles.items &&
          props.articles.items.map(item => (
            <div key={item.id} className={style['item']}>
              <h2 className={style['title']}>
                <Link href="/article/[id]" as={`/article/${item.id}`} prefetch={false}>
                  <a className={style['link']}>{item.title}</a>
                </Link>
              </h2>
              <div className={style['date']}>{dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
