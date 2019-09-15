import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { IconFont } from '@leaa/app/src/components/IconFont';

import { IScreenProps, INavigationStackOptions, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { authUtil } from '@leaa/app/src/utils';
import { useStore } from '@leaa/app/src/stores';
import { LogoutButton } from './_compponents/LogoutButton/LogoutButton';

import style from './style.less';

interface IProps extends IScreenProps {}

export const AccountScreen = (props: IProps) => {
  const store = useStore();

  const paramsUserInfo = props.navigation.state.params && props.navigation.state.params.userInfo;

  const [userInfo, setUserInfo] = useState<IAuthBaseInfo>();

  useEffect(() => {
    setUserInfo(paramsUserInfo);
  }, [paramsUserInfo]);

  useEffect(() => {
    authUtil.getAuthInfo().then(info => info && setUserInfo(info));
  }, []);

  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['container-wrapper']}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={style['user-text-wrapper']}
          onPress={() => !userInfo && props.navigation.navigate('Login', { mode: 'module' })}
        >
          <IconFont name="shequ" size={20} style={style['user-icon']} />
          <Text style={style['user-name']}>{userInfo ? userInfo.name.toUpperCase() : '登录'}</Text>
        </TouchableOpacity>

        {userInfo && (
          <>
            <View style={style['userinfo-wrapper']}>
              <Text style={style['userinfo-content']}>{JSON.stringify(userInfo)}</Text>
            </View>

            <LogoutButton onLogoutCallback={() => setUserInfo(undefined)} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

AccountScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    header: null,
  };
};
