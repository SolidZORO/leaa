import queryString from 'query-string';
import React from 'react';
import { Button } from 'antd';

import { deviceUtil } from '@leaa/www/src/utils';
import { envConfig } from '@leaa/www/src/configs';
import { Rcon } from '@leaa/www/src/components';

import style from './style.module.less';

interface IProps {
  // user: IAuthInfo;
}

export default (props: IProps) => {
  const onSubmitWechat = async () => {
    const wechatLoginApiUrl = `${envConfig.OAUTH_WECHAT_BASE_URL}/auth/wechat/login`;

    const { url, query } = queryString.parseUrl(window.location.href);
    const nextUrl = `${url}?${queryString.stringify({
      ...query,
      platform: 'wechat',
      otk: undefined,
      oid: undefined,
    })}`;

    const wechatLoginUrlParams = {
      jumpUrl: deviceUtil.isClient() ? encodeURIComponent(nextUrl) : '',
      scope: '',
    };

    (window.location as any) = `${wechatLoginApiUrl}?${queryString.stringify(wechatLoginUrlParams)}`;
  };

  return (
    <div className={style['wrapper']}>
      <Button
        type="primary"
        shape="circle"
        className={style['wechat-login-button']}
        onClick={onSubmitWechat}
        icon={<Rcon type="ri-wechat-fill" />}
      />
    </div>
  );
};
