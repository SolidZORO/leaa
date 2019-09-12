import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';

import { IScreenProps, INavigationStackOptions } from '@leaa/app/src/interfaces';
import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

interface IProps extends IScreenProps {}

export const HomeScreen = (props: IProps) => {
  // console.log('PPP >>>>>>>>', props);
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['label-wrapper']}>
        <Text style={style['label-wrapper-text']}>
          <IconFont name="shouye" size={18} /> hello-leaa-app {envConfig.APP_NAME}
        </Text>
      </View>
    </SafeAreaView>
  );
};

HomeScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  // console.log('NNN >>>>>>>>', props);
  return {
    header: null,
  };
};
