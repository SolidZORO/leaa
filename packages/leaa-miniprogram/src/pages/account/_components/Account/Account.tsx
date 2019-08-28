import Taro from '@tarojs/taro';
import { Oauth } from '@leaa/common/src/entrys';
import { View, Text, Image, Button } from '@tarojs/components';

import { envConfig } from '@leaa/miniprogram/src/configs';

import style from './style.less';

export const Account = (props: any) => {
  const getUserInfo: Oauth = Taro.getStorageSync('userInfo');

  const onLogin = async () => {
    let loginResponse: {
      errMsg: string;
      code: string;
    };

    try {
      loginResponse = await Taro.login();
    } catch (e) {
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
      await Taro.showToast({ title: '获取 Session 失败' });

      return;
    }

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
      await Taro.showToast({ title: '获取 UserInfo 失败' });

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
    } catch (e) {
      await Taro.showToast({ title: '获取 Decrypt Data 失败' });
    }

    console.log('decryptDataResponse', decryptDataResponse);
  };

  const onLogout = async () => {
    await Taro.clearStorageSync();

    await Taro.showToast({ title: '清除 Storage' });
  };

  const onShowStorage = async () => {
    Taro.getStorageInfoSync().keys.map(k => console.log(`${k} >>>> ${Taro.getStorageSync(k)}`));
  };

  const onProfile = async () => {
    const a = await Taro.getUserInfo();
    console.log(a);
  };

  const onAuthorize = async () => {
    await Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          Taro.authorize({
            scope: 'scope.userInfo',
          });
        }
      },
    });
  };

  const onGetSetting = async () => {
    const s = await Taro.getSetting();

    console.log(s);
  };

  const onGetUserInfo = async () => {
    console.log('onGetUserInfo');

    await Taro.getUserInfo({
      lang: 'zh_CN',
      withCredentials: true,
      success(res) {
        console.log(res);
      },
      fail(e) {
        console.log(e);
      },
    });
  };

  const onCheckSession = async (e: any) => {
    await Taro.checkSession({
      success(res) {
        console.log('checkSession - success');
        console.log(res);
      },
      fail() {
        console.log('checkSession - fail');
        onLogin();
      },
    });
  };

  return (
    <View>
      <View>
        <Text>USER INFO</Text>
        <Image src={getUserInfo.avatar_url} mode="aspectFit" style={{ width: '40px', height: '40px' }} />

        <Text>{JSON.stringify(getUserInfo.nickname)}</Text>

        <Button onClick={onLogin}>Login</Button>
        <hr />

        <Button onClick={onShowStorage}>ShowStorage</Button>
        <hr />

        <Button onClick={onLogout}>Logout</Button>
        <hr />

        <Button onClick={onAuthorize}>Authorize</Button>
        <hr />

        <Button onClick={onProfile}>Profile</Button>
        <hr />

        <Button onClick={onGetSetting}>GetSetting</Button>
        <hr />

        <Button onClick={onCheckSession}>CheckSession</Button>
        <hr />

        <Button type="primary" onClick={onGetUserInfo}>
          微信授权登录 T
        </Button>

        <Button openType="getUserInfo" type="primary" onGetUserInfo={onGetUserInfo}>
          微信授权登录 M
        </Button>
        <hr />
      </View>
    </View>
  );
};
