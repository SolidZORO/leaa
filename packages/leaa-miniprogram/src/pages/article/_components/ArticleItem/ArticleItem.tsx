import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import { Article } from '@leaa/common/src/entrys';

import { GET_ARTICLE } from '@leaa/miniprogram/src/graphqls';
import { apolloClient } from '@leaa/miniprogram/src/libs';
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

        let title = (data && data.article && data.article.title) || '文章详情';

        title = title.length > 15 ? `${title.substr(0, 15)}...` : title;

        Taro.setNavigationBarTitle({ title }).then();
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

          <View className={style['typo']}>
            {Taro.getEnv() === 'WEAPP' ? (
              <HtmlParse html={getArticleQuery.article.content} />
            ) : (
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: getArticleQuery.article.content || '' }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};
