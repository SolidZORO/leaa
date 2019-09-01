import React from 'react';
import { Text, View } from 'react-native';

import style from './style.less';

export const HomeScreen = () => {
  return (
    <View style={style['container']}>
      <View style={style['textwrapper']}>
        <Text style={style['home-label']}>hello-leaa-app</Text>
      </View>
    </View>
  );
};
