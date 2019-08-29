import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { apolloClient } from '@leaa/miniprogram/src/libs';
import { GET_ARTICLE } from '@leaa/miniprogram/src/graphqls';
import { Article } from '@leaa/miniprogram/src/entrys';
import { HtmlParse } from '@leaa/miniprogram/src/components/HtmlParse';

import style from './style.less';

interface IProps {
  articleId: string;
}

export const ArticleItem = (props: IProps) => {
  const [getArticleQuery, setGetArticleQuery] = useState<{ article: Article }>();
  const [getArticleLoading, setGetArticleLoading] = useState<boolean>(false);

  useEffect(() => {
    setGetArticleLoading(true);

    apolloClient
      .query({
        query: GET_ARTICLE,
        variables: { id: Number(props.articleId) },
        fetchPolicy: 'network-only',
      })
      .then(({ data, loading }) => {
        console.log('THEN', loading);

        setGetArticleQuery(data);
      })
      .catch(error => {
        console.log('CATCH');

        console.error(error);
      })
      .finally(() => {
        setGetArticleLoading(false);
      });
  }, []);

  console.log(getArticleLoading);

  return (
    <View>
      {getArticleQuery && getArticleQuery.article && getArticleQuery.article && (
        <View>
          <Text className={style['title']}>{getArticleQuery.article.title}</Text>

          <HtmlParse html={getArticleQuery.article.content} />
        </View>
      )}
    </View>
  );
};
