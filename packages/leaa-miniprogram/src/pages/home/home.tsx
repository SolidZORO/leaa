import Taro, { useState } from '@tarojs/taro';
import { View, Button, Icon, Text, Navigator } from '@tarojs/components';

import style from './style.less';

export default (props: any) => {
  const [n, setN] = useState(1);

  const addN = () => setN(n + 1);
  const subN = () => setN(n - 1);

  return (
    <View>
      <View>
        <Text className={style['title']}>Numbers + - {n}</Text>
        <Button onClick={addN}>+</Button>
        <Button onClick={subN}>-</Button>
        <hr />

        <Icon size="60" type="success" />

        <Navigator className="tag" url="/pages/article/article">
          <Button>Article</Button>
        </Navigator>

        <Text className="icon fi anticon-x-menu" />

        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>----------------</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article111111111</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
        <View>
          <Text>Article</Text>
        </View>
      </View>
    </View>
  );
};
