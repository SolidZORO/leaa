import cx from 'classnames';
import React from 'react';
import { NextPageContext } from 'next';

import { IBasePageProps } from '@leaa/www/src/interfaces';
import { PageCard, HtmlMeta } from '@leaa/www/src/components';

import SignupForm from './_components/SignupForm/SignupForm';

import style from './style.module.less';

const nextPage = ({ router }: IBasePageProps) => {
  return (
    <PageCard>
      <HtmlMeta title="Sign Up" />

      <div className={style['signup-wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={cx('g-container-card', style['signup-box'])}>
            <h2 className={style['title']}>Sign Up</h2>
            <div className={style['signup-form']}>
              <SignupForm urlQuery={router.query} />
            </div>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: NextPageContext) => {
  return { query: ctx.query };
};

export default nextPage;
