import Taro, { useState } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

import { apolloClient } from '@leaa/miniprogram/src/libs';
import { GET_ARTICLES } from '@leaa/miniprogram/src/graphqls';

import style from './style.less';

export default (props: any) => {
  const [n, setN] = useState(1);
  const [data, setData] = useState<any>(null);

  const addN = () => setN(n + 1);
  const subN = () => setN(n - 1);

  apolloClient
    .query({
      query: GET_ARTICLES,
      variables: {},
    })
    .then(resultData => {
      if (!data) {
        setData(resultData);
      }
      // console.log(data);
    })
    .catch(error => {
      console.error(error);
    });

  // console.log(env);

  return (
    <View>
      <View>
        <Text className={style['json']}>{JSON.stringify(data)}</Text>
      </View>

      <View>
        <Text className={style['title']}>Numbers + - {n}</Text>
        <Button onClick={addN}>+</Button>
        <Button onClick={subN}>-</Button>
      </View>
    </View>
  );
};
