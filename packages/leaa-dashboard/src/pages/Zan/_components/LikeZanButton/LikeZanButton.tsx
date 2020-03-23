import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Button, Input } from 'antd';
import { ButtonSize } from 'antd/lib/button';

import { Zan } from '@leaa/common/src/entrys';
import { LIKE_ZAN, GET_ZAN } from '@leaa/dashboard/src/graphqls';
import { Rcon } from '@leaa/dashboard/src/components';
import { msgUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  uuid?: string;
  loading?: boolean;
  className?: string;
  showInput?: boolean;
  size?: ButtonSize;
  zanInputWidth?: number;
}

export const LikeZanButton = (props: IProps) => {
  const { t } = useTranslation();

  const [zanUuid, setZanUuid] = useState<string | undefined>(props.uuid);

  useEffect(() => setZanUuid(props.uuid), [props.uuid]);

  // mutation
  const [likeZanMutate, likeZanMutation] = useMutation<{ zan: Zan }>(LIKE_ZAN, {
    variables: { uuid: zanUuid },
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted(e) {
      msgUtil.message(t('_page:Zan.liked'));
    },
    refetchQueries: () => [{ query: GET_ZAN, variables: { uuid: zanUuid } }],
  });

  const buttonSize = props.size || 'small';

  return (
    <div className={cx(style['wrapper'], props.className)}>
      {props.showInput && (
        <Input
          size={buttonSize}
          className={style['zan-input']}
          value={zanUuid}
          style={{ width: props.zanInputWidth || 320 }}
          onChange={(v) => setZanUuid(v.target.value)}
          placeholder="Zan UUID"
        />
      )}

      <Button
        onClick={() => likeZanMutate()}
        size={buttonSize}
        type="dashed"
        shape="round"
        className={style['like-button']}
        icon={<Rcon type="ri-thumb-up-line" />}
        loading={likeZanMutation.loading}
      >
        {t('_page:Zan.like')}
      </Button>
    </div>
  );
};
