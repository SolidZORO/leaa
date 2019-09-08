import React from 'react';
import { Animated } from 'react-native';

import style from './style.less';

interface IProps {
  title: string;
  scrollOffset: any;
}

export const AnimatedTitle = (props: IProps) => (
  <Animated.Text
    style={{
      ...style['header-title-text'],
      fontSize: props.scrollOffset.interpolate({
        inputRange: [0, 150],
        outputRange: [32, 16],
        extrapolate: 'clamp',
      }),
    }}
  >
    {props.title}
  </Animated.Text>
);
