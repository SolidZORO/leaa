import queryString from 'query-string';
import React from 'react';
import { Button } from 'antd';
import { deviceUtil } from '@leaa/www/utils';
import { envConfig } from '@leaa/www/configs';

import style from './style.less';

interface IProps {
  // user: IAuthInfo;
}

export default (props: IProps) => {
  const onSubmitWechat = async () => {
    const wechatLoginApiUrl = `${envConfig.OAUTH_WECHAT_BASE_URL}/oauth/wechat/login`;

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
      <Button size="large" type="primary" className={style['wechat-login-button']} onClick={onSubmitWechat}>
        Wechat Login
      </Button>
    </div>
  );
};
