/* eslint-disable global-require */

import React, { useState, useEffect } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { ApolloProvider } from '@apollo/react-hooks';
import { useScreens } from 'react-native-screens'; // eslint-disable-line import/no-unresolved
import { Provider } from '@ant-design/react-native';

import { apolloClient } from '@leaa/app/src/libs/apollo-client.lib';
import { AppContainer } from '@leaa/app/src/navs/AppNavigator/AppNavigator';
import { themeConfig } from '@leaa/app/src/configs';

useScreens(); // @see https://reactnavigation.org/docs/en/react-native-screens.html

export default () => {
  const [fontIsReady, setFontIsReady] = useState<boolean>(false);

  const loadFont = async () => {
    await Font.loadAsync({
      antoutline: require('@leaa/app/src/assets/fonts/antd/antoutline.ttf'),
      antfill: require('@leaa/app/src/assets/fonts/antd/antfill.ttf'),
    });

    setFontIsReady(true);
  };

  useEffect(() => {
    loadFont().then();
  }, []);

  if (!fontIsReady) {
    return <AppLoading />;
  }

  return (
    <Provider theme={themeConfig}>
      <ApolloProvider client={apolloClient}>
        <AppContainer theme="light" />
      </ApolloProvider>
    </Provider>
  );
};
