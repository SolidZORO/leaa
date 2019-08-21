import Taro, { useTabItemTap, useDidShow, useRouter, useEffect, useState } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';

import cx from 'classnames';

import { IconFont } from '@leaa/miniprogram/src/components/IconFont';

import style from './style.less';

const tabbars = [
  { icon: 'home', label: 'Home', pagePath: '/pages/home/home' },
  { icon: 'article', label: 'Article', pagePath: '/pages/article/article' },
  { icon: 'account', label: 'Account', pagePath: '/pages/account/account' },
];

export const CustomTabBar = () => {
  const [current, setCurrent] = useState<string>();
  //
  const onSwitch = (url: string) => {
    Taro.switchTab({ url }).then(e => {});
  };

  const c = Taro.getCurrentPages() && Taro.getCurrentPages()[0] && Taro.getCurrentPages()[0].route;

  useEffect(() => {
    const p = `/${c}`;

    // console.log('UUUUUUUUU', p);

    setCurrent(p);
  }, [c]);

  return (
    <View className={style.wrapper}>
      {tabbars.map(tab => (
        <View
          key={tab.label}
          className={cx(style['item'], { [style['item--action']]: tab.pagePath === current })}
          onClick={() => onSwitch(tab.pagePath)}
        >
          <View className={style['icon']}>
            <IconFont type={tab.icon} />
          </View>
          <Text className={style['label']}>{tab.label}</Text>
        </View>
      ))}
    </View>
  );
};
