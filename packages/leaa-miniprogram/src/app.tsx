import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import { ApolloProvider } from '@apollo/react-hooks';
import promiseFinally from 'promise.prototype.finally';

import { apolloClient } from '@leaa/miniprogram/src/libs';
import Home from '@leaa/miniprogram/src/pages/home/home';

import '@leaa/miniprogram/src/styles/global.less';

promiseFinally.shim();

class App extends Component {
  config: Config = {
    // prettier-ignore
    pages: [
      'pages/home/home',
      'pages/article/article',
      'pages/account/account',
      'pages/about/about',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Leaa Miniprogram',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      custom: true,
      color: '#212121',
      selectedColor: '#5232c2',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          text: 'Home',
          pagePath: 'pages/home/home',
          // iconPath: './assets/icons/tabbar/home.png',
          // selectedIconPath: './assets/icons/tabbar/home.png',
        },
        {
          text: 'Article',
          pagePath: 'pages/article/article',
          // iconPath: './assets/icons/tabbar/article.png',
          // selectedIconPath: './assets/icons/tabbar/article.png',
        },
        {
          text: 'Account',
          pagePath: 'pages/account/account',
          // iconPath: './assets/icons/tabbar/account.png',
          // selectedIconPath: './assets/icons/tabbar/account.png',
        },
      ],
    },
  };

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Home />
      </ApolloProvider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
