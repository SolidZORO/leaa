import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { IconFont } from '@leaa/app/src/components/IconFont';

import { HomeScreen } from '@leaa/app/src/screens/Home/HomeScreen/HomeScreen';
import { ArticleListScreen } from '@leaa/app/src/screens/Article/ArticleListScreen/ArticleListScreen';
import { AccountScreen } from '@leaa/app/src/screens/Account/AccountScreen/AccountScreen';

const buildTabBarIcon = (iconName: string, props: any) => (
  <IconFont name={iconName} size={18} style={{ color: props.tintColor }} />
);

export const AppBottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: '首页',
        tabBarIcon: (props: any) => buildTabBarIcon('shouye', props),
      },
    },
    ArticleList: {
      screen: ArticleListScreen,
      navigationOptions: {
        tabBarLabel: '文章',
        tabBarIcon: (props: any) => buildTabBarIcon('wenzhang', props),
      },
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: (props: any) => buildTabBarIcon('shequ', props),
      },
    },
  },
  {
    // mode: 'modal',
    initialRouteName: 'Account',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    headerMode: 'none',
    navigationOptions: {
      header: null,
    },
    // lazy: true,
    safeAreaInset: true,
    tabBarOptions: {
      // showLabel: false,
      tabStyle: {
        paddingVertical: 4,
      },
      activeTintColor: '#6a3cff',
      inactiveTintColor: '#aaa',
    },
  },
);
