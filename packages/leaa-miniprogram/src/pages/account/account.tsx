import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { Account } from './_components/Account/Account';

export default class extends Taro.Component {
  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 2,
      });
    }
  }

  public render() {
    return (
      <View>
        <Account />
      </View>
    );
  }
}
