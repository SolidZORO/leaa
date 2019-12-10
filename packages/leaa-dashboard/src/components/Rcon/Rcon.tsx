import React, { forwardRef } from 'react';
import cx from 'classnames';

import { createFromIconfontCN } from '@ant-design/icons';
import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';

// @ts-ignore
import localIconfont from '@leaa/dashboard/src/assets/fonts/ri/iconfont';

import style from './style.module.less';

type IIconType =
  | 'ri-x-add-line'
  | 'ri-function-line'
  | 'ri-paint-brush-line'
  | 'ri-filter-line'
  | 'ri-search-line'
  | 'ri-settings-line'
  | 'ri-t-shirt-line'
  | 'ri-time-line'
  | 'ri-store-line'
  | 'ri-hd-line'
  | 'ri-swap-box-line'
  | 'ri-eye-line'
  | 'ri-terminal-box-line'
  | 'ri-archive-line'
  | 'ri-coupon-line'
  | 'ri-search-eye-line'
  | 'ri-shield-user-line'
  | 'ri-voiceprint-line'
  | 'ri-zoom-in-line'
  | 'ri-code-s-slash-line'
  | 'ri-home-5-line'
  | 'ri-coupon-3-line'
  | 'ri-price-tag-3-line'
  | 'ri-user-3-line'
  | 'ri-edit-2-line'
  | 'ri-file-list-2-line'
  | 'ri-lock-2-line'
  | 'ri-translate-2'
  | 'ri-vip-crown-2-line'
  | 'ri-plus-line';

interface IProps extends IconBaseProps {
  // type: string;
  type: IIconType | string | undefined;
  className?: string;
}

const iconfontPrefix = 'anticon-';

export const Rcon = forwardRef((props: IProps, ref: React.Ref<any>) => {
  // ANTD OFFICIAL ICON --> '//at.alicdn.com/t/font_1329669_t1u72b9zk8s.js'
  const CustomIcon: any = createFromIconfontCN({ scriptUrl: localIconfont, extraCommonProps: { ...props } });

  return (
    <CustomIcon
      className={cx(style['custom-icon'], 'anticon', props.className)}
      type={`${iconfontPrefix}${props.type}`}
    />
  );
});
