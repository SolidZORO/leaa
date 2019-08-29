import Taro from '@tarojs/taro';

import { ArticleItem } from './_components/ArticleItem/ArticleItem';

export default class extends Taro.Component {
  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 1,
      });
    }
  }

  render() {
    return <ArticleItem articleId={this.$router.params.id} />;
  }
}
