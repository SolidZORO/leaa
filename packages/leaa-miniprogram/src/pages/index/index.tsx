import Taro from '@tarojs/taro';
import { View, Button, Text, Navigator } from '@tarojs/components';

import style from './style.less';

interface IProps {}

export default (props: IProps) => {
  return (
    <View>
      <Text className={style['title']}>Hello</Text>
      <Button>OK</Button>

      <Navigator className="tag" url="/pages/test/test">
        <Text>TEST PAGE</Text>
      </Navigator>
    </View>
  );
};
