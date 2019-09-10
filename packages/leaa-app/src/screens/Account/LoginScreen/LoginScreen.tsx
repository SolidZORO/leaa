import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';

import { IScreenProps } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LoginScreen = (props: IProps) => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['header-title']}>
        <Text style={style['header-title-text']}>LOGIN</Text>
      </View>
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = (props: IProps) => {};
