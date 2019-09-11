import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';

import { LOGIN_FOR_WWW } from '@leaa/common/src/graphqls';
import { User } from '@leaa/app/src/entrys';
import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions, ILogin } from '@leaa/app/src/interfaces';
import { authUtil } from '@leaa/app/src/utils';
import { ErrorCard } from '@leaa/app/src/components/ErrorCard';

import { LoginForm } from './_compponents/LoginForm/LoginForm';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LoginScreen = (props: IProps) => {
  const [submitLoginMutate, submitLoginMutation] = useMutation<{ login: User }>(LOGIN_FOR_WWW, {
    async onCompleted({ login }) {
      console.log(login);
      if (login && login.name) {
        const authInfo = {
          id: login.id,
          email: login.email,
          name: login.name,
        };

        await authUtil.setAuthInfo(authInfo);
      }

      if (login && login.authToken && login.authExpiresIn) {
        await authUtil.setAuthToken(login.authToken, login.authExpiresIn);
        await authUtil.setAuthToken(login.authToken, login.authExpiresIn);

        // if (props.onLoginedCallback) {
        //   props.onLoginedCallback();
        // }
      }

      // return Router.push('/account');
    },
  });

  const onSubmit = async (userInfo: ILogin) => {
    const variables: { user: ILogin } = {
      user: userInfo,
    };

    await submitLoginMutate({ variables });
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      {submitLoginMutation.error ? <ErrorCard error={submitLoginMutation.error} message="登录信息有误" /> : null}
      <View style={style['header-title']}>
        <LoginForm onSubmitCallback={onSubmit} />
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
