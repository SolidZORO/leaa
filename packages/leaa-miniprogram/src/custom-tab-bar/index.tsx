import cx from 'classnames';
import Taro from '@tarojs/taro';
import { Text, View } from '@tarojs/components';

// the `<IconFont />` component cannot be reused here!
import '@leaa/miniprogram/src/assets/fonts/fi/iconfont.global.less';
import style from './style.less';

interface IProps {}

interface IState {
  selectedSlug: string;
}

const tabbars: { icon: string; text: string; slug: string; pagePath: string }[] = [
  { icon: 'home', slug: 'home', text: '首页', pagePath: '/pages/home/home' },
  { icon: 'article', slug: 'article', text: '文章', pagePath: '/pages/article/article-list' },
  { icon: 'account', slug: 'account', text: '我的', pagePath: '/pages/account/account' },
];

export class CustomTabBar extends Taro.Component<IProps, IState> {
  state = {
    selectedSlug: 'home',
  };

  onSwitchTab = (url: string) => {
    Taro.switchTab({ url }).then();
  };

  render() {
    const { selectedSlug } = this.state;

    return (
      <View className={style.wrapper}>
        {tabbars.map(t => (
          <View
            key={t.slug}
            className={cx(style['item'], { [style['item--action']]: selectedSlug === t.slug })}
            onClick={() => this.onSwitchTab(t.pagePath)}
          >
            <View className={style['icon']}>
              <Text className={`fi anticon-x-${t.icon}`} />
            </View>

            <Text className={style['label']}>{t.text}</Text>
          </View>
        ))}
      </View>
    );
  }
}
