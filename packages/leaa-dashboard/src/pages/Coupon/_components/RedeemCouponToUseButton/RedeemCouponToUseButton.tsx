import cx from 'classnames';
import React, { useState } from 'react';
import { Popconfirm, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { LoadingOutlined } from '@ant-design/icons';

import { Coupon } from '@leaa/common/src/entrys';

import { UserSearchBox, IdTag, Rcon } from '@leaa/dashboard/src/components';
import { REDEEM_COUPON } from '@leaa/dashboard/src/graphqls';
import { removeLangSpace, can, msg } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  item: Coupon;
  canRedeem?: boolean;
  onConvetCompletedCallback?: () => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RedeemCouponToUseButton = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const [userId, setUserId] = useState<string | undefined>();
  const [visible, setVisible] = useState<boolean>(false);

  // mutation
  const [redeemCouponMutate, redeemCouponMutation] = useMutation<Coupon>(REDEEM_COUPON, {
    variables: { info: { code: props.item.code, userId } },
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => {
      msg(t('_lang:updatedSuccessfully'));
      setVisible(false);

      if (props.onConvetCompletedCallback) {
        props.onConvetCompletedCallback();
      }
    },
  });

  const onSubmit = () => redeemCouponMutate();

  if (props.item.user_id || !props.item.canRedeem || !can('coupon.item-redeem--to-all-user-id')) {
    return (
      <code className={style['normal-status']}>
        <IdTag id={props.item.user_id} link={`/users/${props.item.user_id}`} icon={<Rcon type="ri-user-3-line" />} />
      </code>
    );
  }

  return (
    <div className={cx(style['wrapper'], props.className)} style={props.style}>
      <Popconfirm
        // visible
        visible={visible}
        overlayClassName={style['redeem-popconfirm']}
        icon={null}
        title={
          <div className={style['redeem-popconfirm-container']}>
            <Button
              shape="circle"
              type="dashed"
              icon={<Rcon type="ri-close-line" />}
              size="small"
              onClick={() => setVisible(false)}
              className={style['close-button']}
            />

            <div className={style['title']}>{t('_page:Coupon.redeemToUser')} :</div>

            <div className={style['content']}>
              <UserSearchBox
                useOnBlur
                onSelectUserCallback={(user) => setUserId(user && user.id)}
                onEnterCallback={(v) => setUserId(v)}
                // value={tagName}
                placeholder={removeLangSpace(`${t('_lang:search')} ${t('_lang:user')}`, i18n.language)}
                style={{ width: 250 }}
              />

              <Button
                className={cx(style['submit-redeem-button'])}
                icon={redeemCouponMutation.loading ? <LoadingOutlined /> : <Rcon type="ri-swap-box-line" />}
                disabled={typeof userId === 'undefined'}
                onClick={onSubmit}
                type="primary"
              >
                {t('_page:Coupon.redeem')}
              </Button>
            </div>
          </div>
        }
      >
        <Button
          onClick={() => setVisible(true)}
          className={cx(style['redeem-button'])}
          icon={<Rcon type="ri-swap-box-line" />}
          size="small"
          type="link"
        >
          {t('_page:Coupon.redeem')}
        </Button>
      </Popconfirm>
    </div>
  );
};
