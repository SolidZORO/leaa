import Taro, { useState } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

import { apolloClient } from '@leaa/miniprogram/src/libs';
import { GET_ARTICLES } from '@leaa/miniprogram/src/graphqls';
import { ArticleArgs, ArticlesWithPaginationObject } from '@leaa/miniprogram/src/dtos/article';

import style from './style.less';

export const Account = (props: any) => {
  const [getArticlesVariables, setGetArticlesVariables] = useState<ArticleArgs>({ page: 1, pageSize: 30 });
  const [getArticlesQuery, setGetArticlesQuery] = useState<{ articles: ArticlesWithPaginationObject }>();
  const [getArticlesLoading, setGetArticlesLoading] = useState<boolean>(false);

  const onLogin = () => {
    Taro.login({
      success: e => {
        console.log('CODE', e.code);

        Taro.request({
          url: 'http://v8hfrm.natappfree.cc/oauth/test',
          data: {
            code: e.code,
          },
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            console.log('success', res);
          },
          fail(res) {
            console.log('fail', res);
          },
        });

        // apolloClient
        //   .query({
        //     query: GET_ARTICLES,
        //     variables: getArticlesVariables,
        //     fetchPolicy: 'network-only',
        //   })
        //   .then(({ data, loading }) => {
        //     console.log('THEN', loading);
        //
        //     console.log(data);
        //
        //     // setGetArticlesQuery(data);
        //   })
        //   .catch(error => {
        //     console.log('CATCH');
        //
        //     console.error(error);
        //   })
        //   .finally(() => {
        //     setGetArticlesLoading(false);
        //   });
      },
    }).then();
  };

  return (
    <View>
      <View>
        <Text className={style['title']}>ACCOUNT</Text>

        <Button onClick={onLogin}>Login</Button>
      </View>
    </View>
  );
};
