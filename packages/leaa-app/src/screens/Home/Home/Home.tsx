import React from 'react';
import { Text, View } from 'react-native';

import { IScreenProps } from '@leaa/app/src/interfaces';
import { envConfig } from '@leaa/app/src/configs';
import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

export const Home = (props: IScreenProps) => {
  return (
    <View style={style['container']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']}>
          <IconFont name="shouye" size={18} /> hello-leaa-app {envConfig.APP_NAME}
        </Text>
      </View>
    </View>
  );
};

Home.navigationOptions = {
  title: 'Home',
};
