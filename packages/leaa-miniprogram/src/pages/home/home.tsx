import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Banner } from './_components/Banner/Banner';

export default class extends Taro.Component {
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: 'leaa-demo' }).then();

    // Taro.switchTab({ url: '/pages/article/article-list' }).then();
    Taro.navigateTo({ url: '/pages/article/article-item?id=28' }).then();
    // Taro.switchTab({ url: '/pages/account/account' }).then();
  }

  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selectedSlug: 'home',
      });
    }
  }

  public render() {
    return (
      <View>
        <Banner />
      </View>
    );
  }
}
