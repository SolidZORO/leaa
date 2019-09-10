import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';

import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const SignupScreen = (props: IProps) => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['header-title']}>
        <Text style={style['header-title-text']}>SIGNUP</Text>
      </View>
    </SafeAreaView>
  );
};

SignupScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    // title: 'Signup',
    headerTransparent: true,
    headerStyle: { marginTop: 30, backgroundColor: 'red' },
    headerLeft: () => (
      <Text
        onPress={() => props.navigation.navigate('Login')}
        style={{ marginLeft: 10, width: 30, textAlign: 'center' }}
      >
        <IconFont name="return" size={24} />
      </Text>
    ),
  };
};
