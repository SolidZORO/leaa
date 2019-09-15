import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import { AppBottomTabNavigator } from '@leaa/app/src/navs/AppBottomTabNavigator/AppBottomTabNavigator';

import { ArticleItemScreen } from '@leaa/app/src/screens/Article/ArticleItemScreen/ArticleItemScreen';
import { LoginScreen } from '@leaa/app/src/screens/Auth/LoginScreen/LoginScreen';
import { SignupScreen } from '@leaa/app/src/screens/Auth/SignupScreen/SignupScreen';
import { KeepScreen } from '@leaa/app/src/screens/Playground/KeepScreen/KeepScreen';

export const AuthNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignupScreen },
});

export const AppNavigator = createStackNavigator(
  {
    AppBottomTabNavigator: {
      screen: AppBottomTabNavigator,
    },
    ArticleItem: {
      screen: ArticleItemScreen,
    },
    Keep: {
      screen: KeepScreen,
    },
  },
  {
    mode: 'card',
  },
);

export const AppContainer = createAppContainer(
  createStackNavigator(
    {
      App: AppNavigator,
      Auth: AuthNavigator,
    },
    {
      // initialRouteName: 'Auth',
      mode: 'modal',
      headerMode: 'none',
    },
  ),
);
