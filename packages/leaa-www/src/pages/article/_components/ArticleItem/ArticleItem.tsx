import React from 'react';
import cx from 'classnames';

import { Article } from '@leaa/common/src/entrys';

import style from './style.less';

interface IProps {
  article: Article;
}

export default (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={cx('g-container-card', style['container-card'])}>
          <h1 className={style['title']}>{props.article.title}</h1>
          <div className={style['content']}>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: props.article.content || '' }}
              className={style['typo']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
