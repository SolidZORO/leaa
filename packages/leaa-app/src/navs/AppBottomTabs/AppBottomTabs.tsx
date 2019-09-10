import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '@leaa/app/src/screens/Home/HomeScreen/HomeScreen';
import { ArticleListScreen } from '@leaa/app/src/screens/Article/ArticleListScreen/ArticleListScreen';
import { AccountScreen } from '@leaa/app/src/screens/Account/AccountScreen/AccountScreen';
import { IconFont } from '@leaa/app/src/components/IconFont';

const AppBottomTabs = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: { tabBarLabel: '首页' },
      params: { icon: 'shouye' },
    },
    ArticleList: {
      screen: ArticleListScreen,
      navigationOptions: { tabBarLabel: '文章' },
      params: { icon: 'wenzhang' },
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: { tabBarLabel: '我的' },
      params: { icon: 'shequ' },
    },
  },
  {
    initialRouteName: 'ArticleList',
    defaultNavigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ tintColor }: any) => (
        <IconFont name={navigation.state.params.icon} size={18} style={{ color: tintColor, paddingTop: 5 }} />
      ),
    }),
    tabBarOptions: {
      activeTintColor: '#6a3cff',
      inactiveTintColor: '#aaa',
      // showLabel: false,
    },
  },
);

// export default AppBottomTabs;
export default createAppContainer(AppBottomTabs);
