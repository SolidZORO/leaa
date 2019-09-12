import React, { useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';

import { IScreenProps, INavigationStackOptions, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { IconFont } from '@leaa/app/src/components/IconFont';
import { authUtil } from '@leaa/app/src/utils';

import style from './style.less';

interface IProps extends IScreenProps {}

export const KeepScreen = (props: IProps) => {
  const [userInfo, setUserInfo] = useState<IAuthBaseInfo>();

  authUtil
    .getAuthInfo()
    .then(info => (info ? setUserInfo(info) : props.navigation.navigate('Login', { mode: 'module' })));

  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['label-wrapper']}>
        <Text style={style['label-wrapper-text']}>
          <IconFont name="xiaoshi" size={18} /> KEEP
        </Text>
      </View>
    </SafeAreaView>
  );
};

KeepScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    header: null,
  };
};
