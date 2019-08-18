import Taro, { useState } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

import style from './style.less';

export default () => {
  const [n, setN] = useState(1);

  const addN = () => setN(n + 1);
  const subN = () => setN(n - 1);

  return (
    <View>
      <Text className={style['title']}>Numbers + - {n}</Text>
      <Button onClick={addN}>+</Button>
      <Button onClick={subN}>-</Button>
    </View>
  );
};
