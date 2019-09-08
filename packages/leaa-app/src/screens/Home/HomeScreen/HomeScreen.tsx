import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { IScreenProps } from '@leaa/app/src/interfaces';
import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

export const HomeScreen = (props: IScreenProps) => {
  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']}>
          <IconFont name="shouye" size={18} /> hello-leaa-app {envConfig.APP_NAME}
        </Text>
      </View>
    </SafeAreaView>
  );
};

HomeScreen.navigationOptions = ({ navigation, navigationOptions }: NavigationScreenProps) => {};
