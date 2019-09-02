import dayjs from 'dayjs';
import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Text, Navigator } from '@tarojs/components';

import { ArticlesWithPaginationObject, ArticleArgs } from '@leaa/common/src/dtos/article';

import { GET_ARTICLES } from '@leaa/miniprogram/src/graphqls';
import { apolloClient } from '@leaa/miniprogram/src/libs';

import style from './style.less';

export const ArticleList = (props: any) => {
  const [getArticlesVariables, setGetArticlesVariables] = useState<ArticleArgs>({ page: 1, pageSize: 30 });
  const [getArticlesQuery, setGetArticlesQuery] = useState<{ articles: ArticlesWithPaginationObject }>();
  const [getArticlesLoading, setGetArticlesLoading] = useState<boolean>(false);

  useEffect(() => {
    setGetArticlesLoading(true);

    apolloClient
      .query({
        query: GET_ARTICLES,
        variables: getArticlesVariables,
        fetchPolicy: 'network-only',
      })
      .then(({ data, loading }) => {
        console.log('THEN', loading);

        // console.log(data);

        setGetArticlesQuery(data);
      })
      .catch(error => {
        console.log('CATCH');

        console.error(error);
      })
      .finally(() => {
        setGetArticlesLoading(false);
      });
  }, [getArticlesVariables]);

  const onChangePage = () => {
    setGetArticlesVariables({ page: 1, pageSize: 30 });
  };

  return (
    <View className={style['wrapper']}>
      {getArticlesQuery &&
        getArticlesQuery.articles &&
        getArticlesQuery.articles.items &&
        getArticlesQuery.articles.items.map(article => (
          <View className={style['item']}>
            <Navigator key={article.id} url={`/pages/article/article-item?id=${article.id}`}>
              <View>
                <Text className={style['title']}>{article.title}</Text>
              </View>

              <View>
                <Text className={style['data']}>{dayjs(article.created_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </View>
            </Navigator>
          </View>
        ))}

      {getArticlesQuery && getArticlesQuery.articles && (
        <Button onClick={onChangePage} loading={getArticlesLoading}>
          加载更多
        </Button>
      )}
    </View>
  );
};
