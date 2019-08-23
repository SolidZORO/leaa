import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

import { envConfig } from '@leaa/miniprogram/src/configs';

import style from './style.less';

export const Account = (props: any) => {
  const onLogin = async () => {
    let loginResponse;

    try {
      loginResponse = await Taro.login();
    } catch (e) {
      await Taro.showToast({ title: '登陆失败' });

      return;
    }

    let sessionResponse;

    try {
      sessionResponse = await Taro.request({
        url: `${envConfig.WECHAT_HOST}/oauth/wechat/session`,
        data: loginResponse,
      });

      if (sessionResponse && sessionResponse.data) {
        Taro.setStorageSync('openid', sessionResponse.data.openid);
        Taro.setStorageSync('session_key', sessionResponse.data.session_key);
      }
    } catch (e) {
      await Taro.showToast({ title: '获取 Session 失败' });

      return;
    }

    const setting = await Taro.getSetting();

    console.log(setting, Taro.getStorageSync('session_key'));
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

  const onGetUserInfo = async (e: any) => {
    console.log(e);
  };
  const onCheckSession = async (e: any) => {
    await Taro.checkSession({});
  };

  return (
    <View>
      <View>
        <Text className={style['title']}>ACCOUNT</Text>

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

        <Button openType="getUserInfo" type="primary" onGetUserInfo={onGetUserInfo}>
          微信授权登录
        </Button>
        <hr />
      </View>
    </View>
  );
};
