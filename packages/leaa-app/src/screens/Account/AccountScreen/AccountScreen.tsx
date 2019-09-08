import React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

export const AccountScreen = () => {
  return (
    <View style={style['container']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']}>
          <IconFont name="shequ" size={18} /> Account {envConfig.APP_NAME}
        </Text>
      </View>
    </View>
  );
};

AccountScreen.navigationOptions = (props: NavigationScreenProps) => {};
