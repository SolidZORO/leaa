import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';

import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const AccountScreen = (props: IProps) => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']} onPress={() => props.navigation.navigate('Login', { mode: 'module' })}>
          <IconFont name="shequ" size={18} /> Account {envConfig.APP_NAME}
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
