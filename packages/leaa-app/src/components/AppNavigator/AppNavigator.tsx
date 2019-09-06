import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import AppBottomTabbar from '@leaa/app/src/components/AppBottomTabbar/AppBottomTabbar';

import { Home } from '@leaa/app/src/screens/Home/Home/Home';
import { ArticleList } from '@leaa/app/src/screens/Article/ArticleList/ArticleList';
import { ArticleItem } from '@leaa/app/src/screens/Article/ArticleItem/ArticleItem';

const navConfig = {
  Tabs: { screen: AppBottomTabbar, path: 'Tabs' },
};

const AppNavigator = createStackNavigator({
  Tabs: {
    ...navConfig.Tabs,
    navigationOptions: {
      header: null,
    },
  },
  Home,
  ArticleList,
  ArticleItem,
});

export default createAppContainer(AppNavigator);
