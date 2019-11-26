import React, { useState, CSSProperties } from 'react';
import cx from 'classnames';
import { Popconfirm, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { User, Coupon } from '@leaa/common/src/entrys';

import { UserSearchBox, ErrorCard, IdTag } from '@leaa/dashboard/src/components';
import { CONVERT_COUPON } from '@leaa/common/src/graphqls';
import { langUtil, permissionUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  item: Coupon;
  available?: boolean;
  onConvetCompletedCallback?: () => void;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ConvertCouponToUseButton = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const [userId, setUserId] = useState<number | undefined>();

  // mutation
  const [convertCouponMutate, convertCouponMutation] = useMutation<Coupon>(CONVERT_COUPON, {
    variables: { info: { code: props.item.code, userId } },
    onCompleted: () => {
      message.success(t('_lang:updatedSuccessfully'));

      if (props.onConvetCompletedCallback) {
        props.onConvetCompletedCallback();
      }
    },
  });

  const onSubmit = () => convertCouponMutate();

  if (props.item.user_id || (!props.item.available || !permissionUtil.hasPermission('coupon.convert-to-any-user'))) {
    return (
      <code className={style['normal-status']}>
        <IdTag id={props.item.user_id} link={`/users/${props.item.user_id}`} />
      </code>
    );
  }

  return (
    <div className={cx(style['wrapper'], props.className)} style={props.style}>
      {convertCouponMutation.error ? <ErrorCard error={convertCouponMutation.error} /> : null}

      <Popconfirm
        // visible
        overlayClassName={style['convert-popconfirm']}
        icon={null}
        title={
          <div className={style['convert-popconfirm-container']}>
            <UserSearchBox
              useOnBlur
              onSelectUserCallback={(user: User) => setUserId(user.id)}
              onEnterCallback={v => setUserId(v)}
              // value={tagName}
              placeholder={langUtil.removeSpace(`${t('_lang:search')} ${t('_lang:user')}`, i18n.language)}
              style={{ width: 250 }}
            />

            <Button
              className={cx(style['submit-convert-button'])}
              icon="x-exchange"
              disabled={typeof userId === 'undefined'}
              onClick={onSubmit}
              type="primary"
              loading={convertCouponMutation.loading}
            >
              {t('_page:Coupon.Component.convert')}
            </Button>
          </div>
        }
      >
        <Button className={cx(style['convert-button'])} icon="x-exchange" size="small" type="link">
          {t('_page:Coupon.Component.convertToUser')}
        </Button>
      </Popconfirm>
    </div>
  );
};
