import React from 'react';
import cx from 'classnames';

import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { Article } from '@leaa/common/src/entrys';

import style from './style.less';

interface IProps {
  article: Article;
}

export default (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <HtmlMeta title={props.article.title} description={props.article.description} />

      <div className={cx('g-full-container', style['full-container'])}>
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
  );
};
