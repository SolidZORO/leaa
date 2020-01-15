import React, { forwardRef } from 'react';
import cx from 'classnames';

import { createFromIconfontCN } from '@ant-design/icons';
import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import style from './style.module.less';
// @ts-ignore
// import localIconfont from '@leaa/www/src/assets/fonts/ri/iconfont';

interface IProps extends IconBaseProps {
  type: string | undefined;
  className?: string;
}

const iconfontPrefix = 'anticon-';

// TIPS: keep this param ref, avoid console warnings!
//
// if not ref in params, console will be warnings.
// if use this ref to <CustomIcon />, in children element (e.g. Tooltips), console will be warnings too.
// so. declare it, but don't use.
export const Rcon = forwardRef((props: IProps, ref: any) => {
  // ANTD OFFICIAL ICON --> '//at.alicdn.com/t/font_1329669_t1u72b9zk8s.js'
  // const CustomIcon: any = createFromIconfontCN({ scriptUrl: localIconfont, extraCommonProps: { ...props } });
  const CustomIcon: any = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1543755_q1e1ibr6a7a.js',
    extraCommonProps: { ...props },
  });

  return (
    <CustomIcon
      className={cx(style['custom-icon'], 'anticon', props.className)}
      type={`${iconfontPrefix}${props.type}`}
    />
  );
});
