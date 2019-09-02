import React from 'react';
import { Text, View, FlatList, SafeAreaView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/src/graphqls/article.query';

import { ErrorCard } from '@leaa/app/src/components/ErrorCard';
import { ArticlesWithPaginationObject } from '@leaa/app/src/dtos/article/articles-with-pagination.object';
import { ArticleArgs } from '@leaa/app/src/dtos/article/article.args';

import style from './style.less';

export const ArticleList = () => {
  const getArticlesVariables = {};
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  const refetchArticles = () => {
    console.log('REFETCH-ARTICLES');
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <View>
        {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

        <View style={style['title']}>
          <Text style={style['title-text']}>文章列表</Text>
        </View>

        <FlatList
          style={style['list']}
          onRefresh={() => refetchArticles()}
          refreshing={getArticlesQuery.loading}
          data={
            (getArticlesQuery.data &&
              getArticlesQuery.data.articles &&
              getArticlesQuery.data.articles.items &&
              getArticlesQuery.data.articles.items.length > 0 &&
              getArticlesQuery.data.articles.items) ||
            null
          }
          keyExtractor={({ title }) => title}
          renderItem={({ item }) => (
            <View style={style['item']}>
              <Text key={item.title} style={style['item-text']}>
                {item.title}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

ArticleList.navigationOptions = {
  title: 'Article',
};
