import React, { useState } from 'react';
import { Text, View, FlatList, SafeAreaView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_ARTICLES } from '@leaa/common/src/graphqls/article.query';

import { ErrorCard } from '@leaa/app/src/components/ErrorCard';
import { ArticlesWithPaginationObject } from '@leaa/app/src/dtos/article/articles-with-pagination.object';
import { ArticlesArgs } from '@leaa/app/src/dtos/article/articles.args';

import style from './style.less';

export const ArticleList = () => {
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
    console.log('ON-REFRESH-ARTICLES~~~~~~');

    (async () => getArticlesQuery.refetch())();

    setGetArticlesPage(1);
  };

  const onEndReachedArticles = async () => {
    console.log('ON-REACHED-ARTICLES!!!!!!!!!');
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
        console.log('>>>>>>>>>>>>', previousResults.articles.nextPage);

        if (!fetchMoreResult) {
          return previousResults;
        }

        const nextResult = {
          ...getArticlesQuery,
          articles: {
            ...fetchMoreResult.articles,
            items: [...previousResults.articles.items, ...fetchMoreResult.articles.items],
          },
        };

        // nextResult.articles.items.map(a => console.log(a.id));

        return nextResult;
      },
      variables: nextArticlesPage,
    });

    setGetArticlesPage(nextPage);
  };

  const separatorDom = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#eee',
      }}
    />
  );

  return (
    <SafeAreaView style={style['wrapper']}>
      <View>
        {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}

        <View style={style['title']}>
          <Text style={style['title-text']}>文章列表</Text>
        </View>

        <FlatList
          style={style['list']}
          refreshing={getArticlesQuery.loading}
          data={
            (getArticlesQuery.data && getArticlesQuery.data.articles && getArticlesQuery.data.articles.items) || null
          }
          keyExtractor={({ id }) => `${id}`}
          renderItem={({ item, index }) => (
            <View style={style['item']}>
              <Text key={item.title} style={style['item-text']}>
                {index}. [#{item.id}] - {item.title}
              </Text>
            </View>
          )}
          ListFooterComponent={getArticlesQuery.loading ? <Text>正在加载更多数据...</Text> : <Text />}
          ItemSeparatorComponent={separatorDom}
          ListEmptyComponent={<Text>EMPTY-DATA</Text>}
          onRefresh={onRefreshArticles}
          onEndReached={onEndReachedArticles}
          onEndReachedThreshold={0.1}
        />
      </View>
    </SafeAreaView>
  );
};

ArticleList.navigationOptions = {
  title: 'Article',
};
