import Taro from '@tarojs/taro';

import { ArticleList } from './_components/ArticleList/ArticleList';

export default class extends Taro.Component {
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '文章列表' }).then();
  }

  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selectedSlug: 'article',
      });
    }
  }

  public render() {
    return <ArticleList />;
  }
}
