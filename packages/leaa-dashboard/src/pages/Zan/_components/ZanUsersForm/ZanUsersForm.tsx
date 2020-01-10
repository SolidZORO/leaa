import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { User, Zan } from '@leaa/common/src/entrys';
import { FormCard, UserAvatar } from '@leaa/dashboard/src/components';

import { ZanProgress } from '../ZanProgress/ZanProgress';
import { LikeZanButton } from '../LikeZanButton/LikeZanButton';

import style from './style.module.less';

interface IProps {
  users?: User[];
  item?: Zan;
  loading?: boolean;
  className?: string;
}

export const ZanUsersForm = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={
          <>
            <span>{t('_page:Zan.zanUserList')}</span>
            <LikeZanButton uuid={props.item?.uuid} />
          </>
        }
      >
        <ZanProgress item={props.item} />

        <div className={style['user-avatar-wrapper']}>
          {props.users?.map(user => (
            <UserAvatar key={user.id} url={user.avatar_url} id={user.id} size={64} className={style['user-avatar']} />
          ))}
        </div>
      </FormCard>
    </div>
  );
};
