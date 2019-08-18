import Taro, { useState } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import gql from 'graphql-tag';
import '@tarojs/async-await';

import { apolloClient } from '../../libs/apollo-client.lib';

import style from './style.less';

export const GET_ARTICLES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    articles(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        title
        slug
        description
        category_id
        category {
          name
          slug
        }
        user_id
        status
        created_at
      }
    }
  }
`;

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
