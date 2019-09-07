import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/src/graphqls/article.query';
import { IScreenProps } from '@leaa/app/src/interfaces/screen.interface';

import { ErrorCard } from '@leaa/app/src/components/ErrorCard';
import { ArticlesWithPaginationObject } from '@leaa/app/src/dtos/article/articles-with-pagination.object';
import { ArticlesArgs } from '@leaa/app/src/dtos/article/articles.args';

import style from './style.less';

export const ArticleList = (props: IScreenProps) => {
  setTimeout(() => props.navigation.navigate('ArticleItem', { id: 70 }), 100);

  const getArticlesVariables: ArticlesArgs = {
    page: 1,
    pageSize: 30,
    orderSort: 'DESC',
    orderBy: 'id',
  };

  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticlesArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  const [getArticlesPage, setGetArticlesPage] = useState<number>(1);

  const onRefreshArticles = () => {
    (async () => getArticlesQuery.refetch())();

    setGetArticlesPage(1);
  };

  const onEndReachedArticles = async () => {
    if (getArticlesQuery.loading || !getArticlesQuery.data || getArticlesQuery.data.articles.nextPage === null) {
      return;
    }

    const nextPage = getArticlesPage + 1;
    const nextArticlesPage = {
      ...getArticlesVariables,
      page: nextPage,
    };

    await getArticlesQuery.fetchMore({
      updateQuery: (previousResults, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResults;
        }

        return {
          ...getArticlesQuery,
          articles: {
            ...fetchMoreResult.articles,
            items: [...previousResults.articles.items, ...fetchMoreResult.articles.items],
          },
        };
      },
      variables: nextArticlesPage,
    });

    setGetArticlesPage(nextPage);
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <View>
        {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

        <View style={style['header-title']}>
          <Text style={style['header-title-text']}>文章列表</Text>
        </View>

        <FlatList
          style={style['list']}
          refreshing={getArticlesQuery.loading}
          data={
            (getArticlesQuery.data && getArticlesQuery.data.articles && getArticlesQuery.data.articles.items) || null
          }
          keyExtractor={({ id }) => `${id}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => props.navigation.navigate('ArticleItem', { ...item })}>
              <View style={style['item']}>
                <View style={style['item-title']}>
                  <Text key={item.title} style={style['item-title-text']}>
                    {item.title}
                  </Text>
                </View>

                <View style={style['item-date']}>
                  <Text key={item.title} style={style['item-date-text']}>
                    {dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={getArticlesQuery.loading ? <Text>正在加载更多数据...</Text> : <Text />}
          ItemSeparatorComponent={() => <View style={style['item-separator']} />}
          ListEmptyComponent={<Text style={style['item-list-empty']}>EMPTY-DATA</Text>}
          onRefresh={onRefreshArticles}
          onEndReached={onEndReachedArticles}
          onEndReachedThreshold={0.2}
        />
      </View>
    </SafeAreaView>
  );
};

ArticleList.navigationOptions = {
  title: 'Article',
  navigationOptions: {
    header: null,
  },
};
