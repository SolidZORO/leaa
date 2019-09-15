import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions } from '@leaa/app/src/interfaces';

import { LoginForm } from './_compponents/LoginForm/LoginForm';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LoginScreen = (props: IProps) => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['header-title']}>
        <LoginForm
          onSubmitCallback={userInfo => {
            const navigateScreen =
              (props.navigation.state.params && props.navigation.state.params.navigateToScreen) || 'Account';

            props.navigation.navigate(navigateScreen, { userInfo });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    // title: 'Login',
    headerTransparent: true,
    headerLeft: () => (
      <Text onPress={() => props.navigation.navigate('App')} style={{ marginLeft: 15, width: 30, textAlign: 'center' }}>
        <IconFont name="close" size={24} />
      </Text>
    ),
    headerRight: (
      <Text onPress={() => props.navigation.navigate('Signup')} style={{ marginRight: 15, textAlign: 'center' }}>
        注册账号
      </Text>
    ),
  };
};
