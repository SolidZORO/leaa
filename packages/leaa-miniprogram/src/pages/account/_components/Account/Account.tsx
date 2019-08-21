import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import style from './style.less';

export const Account = (props: any) => {
  return (
    <View>
      <View>
        <Text className={style['title']}>ACCOUNT</Text>
      </View>
    </View>
  );
};
