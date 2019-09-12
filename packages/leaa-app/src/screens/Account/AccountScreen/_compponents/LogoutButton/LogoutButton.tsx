import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@ant-design/react-native';

import { authUtil } from '@leaa/app/src/utils';

import style from './style.less';

interface IProps {
  onLogoutCallback: () => void;
}

export const LogoutButton = (props: IProps) => {
  const onLogout = async () => {
    await authUtil.removeAuth();

    props.onLogoutCallback();
  };

  return (
    <View style={style['wrapper']}>
      <Button onPress={onLogout} type="ghost" size="small" style={style['logout-button']}>
        <Text>安全退出</Text>
      </Button>
    </View>
  );
};
