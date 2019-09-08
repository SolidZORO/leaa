import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

export const AccountScreen = () => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']}>
          <IconFont name="shequ" size={18} /> Account {envConfig.APP_NAME}
        </Text>
      </View>
    </SafeAreaView>
  );
};

AccountScreen.navigationOptions = (props: NavigationScreenProps) => {};
