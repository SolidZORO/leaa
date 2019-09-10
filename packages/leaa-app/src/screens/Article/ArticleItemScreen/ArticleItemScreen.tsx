import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLE } from '@leaa/common/src/graphqls/article.query';
import { IScreenProps } from '@leaa/app/src/interfaces/screen.interface';
import { Article } from '@leaa/app/src/entrys';
import { ArticleArgs } from '@leaa/app/src/dtos/article';

import { IconFont } from '@leaa/app/src/components/IconFont';
import { ErrorCard } from '@leaa/app/src/components/ErrorCard';
import { RenderHtmlWebview } from '@leaa/app/src/components/RenderHtmlWebview';

import style from './style.less';

interface IProps extends IScreenProps {}

export const ArticleItemScreen = (props: IProps) => {
  const id = props.navigation.state.params && props.navigation.state.params.id;

  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(id) },
  });

  return (
    <SafeAreaView style={style['wrapper']}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

      {getArticleQuery && getArticleQuery.data && getArticleQuery.data.article && (
        <RenderHtmlWebview
          title={getArticleQuery.data.article.title}
          content={`${getArticleQuery.data.article.content}`}
          navigation={props.navigation}
        />
      )}
    </SafeAreaView>
  );
};

ArticleItemScreen.navigationOptions = (props: IProps) => {
  const title = props.navigation.state.params && props.navigation.state.params.title;

  return {
    title,
    headerLeft: (
      <Text
        onPress={() => props.navigation.navigate('ArticleList')}
        style={{ marginLeft: 10, width: 30, textAlign: 'center' }}
      >
        <IconFont name="return" size={24} />
      </Text>
    ),
    headerRight: (
      <Text onPress={() => console.log('more')} style={{ marginRight: 10, width: 30, textAlign: 'center' }}>
        <IconFont name="more" size={24} />
      </Text>
    ),
  };
};
