import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { authUtil } from '@leaa/app/src/utils';

import style from './style.less';

interface IProps extends IScreenProps {}

export const AccountScreen = (props: IProps) => {
  const [userInfo, setUserInfo] = useState<IAuthBaseInfo>();

  useEffect(() => {
    authUtil.getAuthInfo().then(info => info && setUserInfo(info));
  }, []);

  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']} onPress={() => props.navigation.navigate('Login', { mode: 'module' })}>
          <IconFont name="shequ" size={18} /> {JSON.stringify(userInfo)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

AccountScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    header: null,
  };
};
