import React from 'react';
import cx from 'classnames';
import Link from 'next/link';

import { ArticlesWithPaginationObject } from '@leaa/common/dtos/article';

import style from './style.less';

interface IProps {
  articles: ArticlesWithPaginationObject;
}

export const ArticleList = (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        {props.articles.items &&
          props.articles.items.map(item => (
            <div key={item.id}>
              <h1>
                <Link href={`/article/${item.id}`}>
                  <a className={style['link']}>{item.title}</a>
                </Link>
              </h1>
            </div>
          ))}
      </div>
    </div>
  );
};
