import React, { useState, CSSProperties } from 'react';
import cx from 'classnames';
import { Popconfirm, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Coupon } from '@leaa/common/src/entrys';

import { UserSearchBox, ErrorCard, IdTag } from '@leaa/dashboard/src/components';
import { REDEEM_COUPON } from '@leaa/common/src/graphqls';
import { langUtil, authUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  item: Coupon;
  canRedeem?: boolean;
  onConvetCompletedCallback?: () => void;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const RedeemCouponToUseButton = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const [userId, setUserId] = useState<number | undefined>();

  // mutation
  const [redeemCouponMutate, redeemCouponMutation] = useMutation<Coupon>(REDEEM_COUPON, {
    variables: { info: { code: props.item.code, userId } },
    onCompleted: () => {
      message.success(t('_lang:updatedSuccessfully'));

      if (props.onConvetCompletedCallback) {
        props.onConvetCompletedCallback();
      }
    },
  });

  const onSubmit = () => redeemCouponMutate();

  if (props.item.user_id || (!props.item.canRedeem || !authUtil.hasPermission('coupon.item-redeem--to-all-user-id'))) {
    return (
      <code className={style['normal-status']}>
        <IdTag id={props.item.user_id} link={`/users/${props.item.user_id}`} />
      </code>
    );
  }

  return (
    <div className={cx(style['wrapper'], props.className)} style={props.style}>
      {redeemCouponMutation.error ? <ErrorCard error={redeemCouponMutation.error} /> : null}

      <Popconfirm
        // visible
        overlayClassName={style['redeem-popconfirm']}
        icon={null}
        title={
          <div className={style['redeem-popconfirm-container']}>
            <div className={style['title']}>{t('_page:Coupon.Component.redeemToUser')} :</div>

            <div className={style['content']}>
              <UserSearchBox
                useOnBlur
                onSelectUserCallback={user => setUserId(user && user.id)}
                onEnterCallback={v => setUserId(v)}
                // value={tagName}
                placeholder={langUtil.removeSpace(`${t('_lang:search')} ${t('_lang:user')}`, i18n.language)}
                style={{ width: 250 }}
              />

              <Button
                className={cx(style['submit-redeem-button'])}
                icon="x-exchange"
                disabled={typeof userId === 'undefined'}
                onClick={onSubmit}
                type="primary"
                loading={redeemCouponMutation.loading}
              >
                {t('_page:Coupon.Component.redeem')}
              </Button>
            </div>
          </div>
        }
      >
        <Button className={cx(style['redeem-button'])} icon="x-exchange" size="small" type="link">
          {t('_page:Coupon.Component.redeem')}
        </Button>
      </Popconfirm>
    </div>
  );
};
