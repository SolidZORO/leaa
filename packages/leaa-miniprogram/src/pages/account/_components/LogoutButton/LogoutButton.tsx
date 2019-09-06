import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';

import style from './style.less';

interface IProps {
  onLogoutCallback?: (timestamp: number) => void;
}

export const LogoutButton = (props: IProps) => {
  const onLogout = async () => {
    await Taro.clearStorageSync();

    if (props.onLogoutCallback) {
      props.onLogoutCallback(new Date().getTime());
    }

    await Taro.showToast({ title: '已安全退出' });
  };

  return (
    <Button className={style['logout-button']} onClick={onLogout}>
      安全退出
    </Button>
  );
};
