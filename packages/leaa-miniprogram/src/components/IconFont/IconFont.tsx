import Taro from '@tarojs/taro';
import { Text } from '@tarojs/components';

import '@leaa/miniprogram/src/assets/fonts/fi/iconfont.less';

interface IProps {
  type: string;
  className?: string;
}

export const IconFont = (props: IProps) => {
  return <Text className={`icon fi anticon-x-${props.type}`} />;
};
