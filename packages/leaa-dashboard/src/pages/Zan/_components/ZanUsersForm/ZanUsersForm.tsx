import cx from 'classnames';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { Zan } from '@leaa/common/src/entrys';
import { FormCard, UserAvatar, ConfirmDeleteButton } from '@leaa/dashboard/src/components';
import { msgUtil } from '@leaa/dashboard/src/utils';
import { DELETE_ZAN_USER, GET_ZAN } from '@leaa/dashboard/src/graphqls';

import { ZanProgress } from '../ZanProgress/ZanProgress';
import { LikeZanButton } from '../LikeZanButton/LikeZanButton';

import style from './style.module.less';

interface IProps {
  item?: Zan;
  loading?: boolean;
  className?: string;
}

export const ZanUsersForm = (props: IProps) => {
  const { t } = useTranslation();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ hashId?: string; userId?: number }>({
    hashId: props.item?.hashId,
    userId: 0,
  });
  const [likeZanMutate, likeZanMutation] = useMutation<{ zan: Zan }>(DELETE_ZAN_USER, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted(e) {
      msgUtil.message(t('_page:Zan.deletedLikeUser'));
    },
    refetchQueries: () => [{ query: GET_ZAN, variables: { hashId: props.item?.hashId } }],
  });

  const deleteZanUser = async (userId: number) => {
    await setSubmitVariables({
      hashId: props.item?.hashId,
      userId,
    });
    await likeZanMutate();
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={
          <>
            <span>{t('_page:Zan.zanUserList')}</span>
            <LikeZanButton hashId={props.item?.hashId} />

            <div className={style['creator-info']}>
              <small>{t('_lang:creator')}</small>
              <UserAvatar url={props.item?.creator?.avatar_url || ''} id={props.item?.creator?.id} size={24} />
            </div>
          </>
        }
      >
        <ZanProgress item={props.item} />
      </FormCard>
    </div>
  );
};
