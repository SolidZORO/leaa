import React from 'react';
import { Text, View } from 'react-native';

import { IconFont } from '@leaa/app/src/components/IconFont';

import style from './style.less';

export const ArticleList = () => {
  return (
    <View style={style['container']}>
      <View style={style['textwrapper']}>
        <Text style={style['label']}>
          <IconFont name="x-article" size={18} /> Article
        </Text>
      </View>
    </View>
  );
};

ArticleList.navigationOptions = {
  title: 'Article',
};
