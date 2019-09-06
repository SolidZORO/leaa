import Taro, { useState } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';

import { envConfig } from '@leaa/miniprogram/src/configs';
// import { MOCK_USER_INFO } from '@leaa/miniprogram/src/pages/account/_components/LoginButton/mock';

import style from './style.less';

interface IProps {
  onLoginCallback?: (timestamp: number) => void;
}

export const LoginButton = (props: IProps) => {
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // const onLoginMock = async () => {
  //   Taro.setStorageSync('openId', '__MOCK_OPENID__');
  //   Taro.setStorageSync('sessionKey', '__MOCK_SESSIONKEY__');
  //   Taro.setStorageSync('userInfo', MOCK_USER_INFO);
  //
  //   await Taro.showToast({ title: '登入成功' });
  //
  //   if (props.onLoginCallback) {
  //     props.onLoginCallback(new Date().getTime());
  //   }
  // };

  const onLogin = async () => {
    setLoginLoading(true);

    let loginResponse: {
      errMsg: string;
      code: string;
    };

    try {
      loginResponse = await Taro.login();
    } catch (e) {
      setLoginLoading(false);
      await Taro.showToast({ title: '登陆失败' });

      return;
    }

    //
    // ------------------------------------
    let sessionResponse: {
      data: {
        openid: string;
        session_key: string;
      };
    };

    try {
      sessionResponse = await Taro.request({
        method: 'POST',
        url: `${envConfig.WECHAT_HOST}/oauth/wechat/session`,
        data: loginResponse,
      });

      if (sessionResponse && sessionResponse.data) {
        Taro.setStorageSync('openId', sessionResponse.data.openid);
        Taro.setStorageSync('sessionKey', sessionResponse.data.session_key);
      }
    } catch (e) {
      console.log(e);
      setLoginLoading(false);
      await Taro.showToast({ title: '获取 Key 失败' });

      return;
    }

    console.log('sessionResponse', sessionResponse);

    //
    // ------------------------------------
    let userInfoResponse: {
      encryptedData: string;
      iv: string;
      rawData: string; // JSON string
      signature: string;
      userInfo: {
        avatarUrl: string;
        city: string;
        country: string;
        gender: number;
        language: string;
        nickName: string;
        province: string;
      };
    };

    try {
      userInfoResponse = await Taro.getUserInfo({
        lang: 'zh_CN',
        withCredentials: true,
      });
    } catch (e) {
      console.log(e);
      setLoginLoading(false);
      await Taro.showToast({ title: '获取 User 失败' });

      return;
    }

    console.log('userInfoResponse', userInfoResponse);

    //
    // ------------------------------------
    let decryptDataResponse;

    try {
      const sendData = {
        encryptedData: userInfoResponse.encryptedData,
        iv: userInfoResponse.iv,
        sessionKey: Taro.getStorageSync('sessionKey'),
        platform: 'wechatminiprogram',
      };

      decryptDataResponse = await Taro.request({
        method: 'POST',
        url: `${envConfig.WECHAT_HOST}/oauth/wechat/decrypt-data`,
        data: sendData,
      });

      Taro.setStorageSync('userInfo', decryptDataResponse.data);

      if (props.onLoginCallback) {
        props.onLoginCallback(new Date().getTime());
      }
    } catch (e) {
      setLoginLoading(false);
      await Taro.showToast({ title: '获取 Decrypt Data 失败' });
    }

    console.log('decryptDataResponse', decryptDataResponse);

    setLoginLoading(false);
  };

  return (
    <View className={style['wrapper']}>
      <Button className={style['login-button']} openType="getUserInfo" onGetUserInfo={onLogin} loading={loginLoading}>
        登录
      </Button>
    </View>
  );
};
