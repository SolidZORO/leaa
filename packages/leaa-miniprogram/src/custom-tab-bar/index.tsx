import cx from 'classnames';
import Taro from '@tarojs/taro';
import { Text, View } from '@tarojs/components';

import { IconFont } from '@leaa/miniprogram/src/components/IconFont';

import style from './style.less';

const tabbars = [
  { icon: 'home', label: '首页', pagePath: '/pages/home/home' },
  { icon: 'article', label: '文章', pagePath: '/pages/article/article' },
  { icon: 'account', label: '我的', pagePath: '/pages/account/account' },
];

interface IProps {}

interface IState {
  selected: number;
}

export class CustomTabBar extends Taro.Component<IProps, IState> {
  state = {
    selected: 0,
  };

  onSwitchTab = (url: string) => {
    Taro.switchTab({ url }).then();
  };

  render() {
    const { selected } = this.state;

    return (
      <View className={style.wrapper}>
        {tabbars.map((tab, index) => (
          <View
            key={tab.label}
            className={cx(style['item'], { [style['item--action']]: selected === index })}
            onClick={() => this.onSwitchTab(tab.pagePath)}
          >
            <View className={style['icon']}>
              <IconFont type={tab.icon} />
            </View>
            <Text className={style['label']}>{tab.label}</Text>
          </View>
        ))}
      </View>
    );
  }
}
