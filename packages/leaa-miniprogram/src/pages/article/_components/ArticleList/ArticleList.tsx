import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Text, Navigator } from '@tarojs/components';
import { apolloClient } from '@leaa/miniprogram/src/libs';
import { GET_ARTICLES } from '@leaa/miniprogram/src/graphqls';
import { ArticlesWithPaginationObject, ArticleArgs } from '@leaa/miniprogram/src/dtos/article';

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
    setGetArticlesVariables({ page: 1, pageSize: 1 });
  };

  return (
    <View>
      <View>
        {getArticlesQuery &&
          getArticlesQuery.articles &&
          getArticlesQuery.articles.items &&
          getArticlesQuery.articles.items.map(article => (
            <Navigator key={article.id} url={`/pages/article/article-item?id=${article.id}`}>
              <Text className={style['title']}>{article.title}</Text>
            </Navigator>
          ))}
      </View>

      <View>
        <Button onClick={onChangePage} loading={getArticlesLoading}>
          P2
        </Button>
      </View>
    </View>
  );
};
