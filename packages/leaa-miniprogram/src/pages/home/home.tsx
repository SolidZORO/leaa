import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { Home } from './_components/Home/Home';

export default class extends Taro.Component {
  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 0,
      });
    }
  }

  public render() {
    return (
      <View>
        <Home />
      </View>
    );
  }
}
