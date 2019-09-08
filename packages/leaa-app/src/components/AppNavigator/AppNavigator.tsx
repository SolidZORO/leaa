import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import AppBottomTabs from '@leaa/app/src/components/AppBottomTabs/AppBottomTabs';

import { HomeScreen } from '@leaa/app/src/screens/Home/HomeScreen/HomeScreen';
import { ArticleListScreen } from '@leaa/app/src/screens/Article/ArticleListScreen/ArticleListScreen';
import { ArticleItemScreen } from '@leaa/app/src/screens/Article/ArticleItemScreen/ArticleItemScreen';
import { LinkWebviewScreen } from '@leaa/app/src/screens/Misc/LinkWebviewScreen/LinkWebviewScreen';

const routeConfigs = {
  Tabs: { screen: AppBottomTabs },
  // Home: {
  //   screen: HomeScreen,
  //   // headerMode: 'none',
  //   navigationOptions: {
  //     header: null,
  //   },
  // },
  ArticleList: { screen: ArticleListScreen },
  ArticleItem: { screen: ArticleItemScreen },
  LinkWebview: { screen: LinkWebviewScreen },
};

// const AppNavigator = createStackNavigator(routeConfigs, {
//   // headerMode: 'none',
//   // navigationOptions: {
//   //   header: null,
//   // },
// });

export default createAppContainer(
  createStackNavigator(routeConfigs, {
    // initialRouteName: 'Home',
    // headerMode: 'none',
    // mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }),
);
