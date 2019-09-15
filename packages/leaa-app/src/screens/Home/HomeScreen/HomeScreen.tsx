import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { IconFont } from '@leaa/app/src/components/IconFont';

import { IScreenProps, INavigationStackOptions, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { authUtil } from '@leaa/app/src/utils';

import style from './style.less';

interface IProps extends IScreenProps {}

export const HomeScreen = (props: IProps) => {
  const onGotoKeep = async () => {
    const userInfo = await authUtil.getAuthInfo();
    console.log(userInfo);

    return userInfo
      ? props.navigation.navigate('Keep')
      : props.navigation.navigate('Login', { mode: 'module', navigateToScreen: 'Keep' });
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['container-wrapper']}>
        <TouchableOpacity activeOpacity={0.5} style={style['home-text-wrapper']} onPress={onGotoKeep}>
          <IconFont name="shequ" size={20} style={style['home-icon']} />
          <Text style={style['home-label']}>Click To Keep</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

HomeScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    header: null,
  };
};
