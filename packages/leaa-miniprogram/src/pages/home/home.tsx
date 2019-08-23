import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { Numbers } from './_components/Numbers/Numbers';
import { Banner } from './_components/Banner/Banner';

export default class extends Taro.Component {
  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 0,
      });
    }
  }

  componentDidMount() {
    Taro.switchTab({ url: '/pages/account/account' }).then();
  }

  public render() {
    return (
      <View>
        <Banner />
        <Numbers />
      </View>
    );
  }
}
