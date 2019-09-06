import React from 'react';
import { Linking, Text, View, SafeAreaView, ScrollView, WebView, Dimensions } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLE } from '@leaa/common/src/graphqls/article.query';
import { IScreenProps } from '@leaa/app/src/interfaces/screen.interface';
import { Article } from '@leaa/app/src/entrys';
import { ArticleArgs } from '@leaa/app/src/dtos/article';

import { ErrorCard } from '@leaa/app/src/components/ErrorCard';
import getHtml from '@leaa/app/src/screens/Article/ArticleItem/getHtml';
import injectedJavaScript from '@leaa/app/src/screens/Article/ArticleItem/injectedJavaScript';

import style from './style.less';

export const ArticleItem = (props: IScreenProps) => {
  const id = props.navigation.state.params && props.navigation.state.params.id;

  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: { id: Number(id) },
  });

  const onMessage = (e: any) => {
    Linking.openURL(e.nativeEvent.data).catch(err => console.error('An error occurred', err));
  };

  console.log();

  return (
    <SafeAreaView style={style['wrapper']}>
      <View>
        {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}

        {getArticleQuery && getArticleQuery.data && getArticleQuery.data.article && (
          <>
            <View style={{ flex: 1 }}>
              <View style={style['header-title']}>
                <Text style={style['header-title-text']}>{getArticleQuery.data.article.title}</Text>
              </View>

              <WebView
                onMessage={onMessage}
                injectedJavaScript={injectedJavaScript}
                scrollEnabled
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                decelerationRate="normal"
                automaticallyAdjustContentInsets={false}
                // startInLoadingState
                source={{ html: `${getArticleQuery.data.article.content}`, baseUrl: '' }}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

ArticleItem.navigationOptions = {
  title: 'Article Item',
};
