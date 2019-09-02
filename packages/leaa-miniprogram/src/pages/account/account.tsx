import Taro from '@tarojs/taro';

import { Account } from './_components/Account/Account';

export default class extends Taro.Component {
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '我的账户' }).then();
  }

  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selectedSlug: 'account',
      });
    }
  }

  public render() {
    return <Account />;
  }
}
