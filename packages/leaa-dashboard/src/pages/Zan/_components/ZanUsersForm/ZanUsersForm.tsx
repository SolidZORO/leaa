import cx from 'classnames';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { User } from '@leaa/common/src/entrys';

import { FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  users?: User[];
  loading?: boolean;
  className?: string;
}

export const ZanUsersForm = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:Zan.zanUser')}>{JSON.stringify(props.users)}</FormCard>
    </div>
  );
};
