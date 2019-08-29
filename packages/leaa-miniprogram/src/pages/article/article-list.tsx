import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { ArticleList } from './_components/ArticleList/ArticleList';

export default class extends Taro.Component {
  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 1,
      });
    }
  }

  public render() {
    return <ArticleList />;
  }
}
