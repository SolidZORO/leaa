import Taro, { Component, Config } from '@tarojs/taro';

import Index from './pages/index';

class App extends Component {
  config: Config = {
    // prettier-ignore
    pages: [
      'pages/index/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Leaa',
      navigationBarTextStyle: 'black',
    },
  };

  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById('app'));
