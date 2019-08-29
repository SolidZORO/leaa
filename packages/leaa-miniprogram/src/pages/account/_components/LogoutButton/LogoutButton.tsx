import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';

import style from './style.less';

interface IProps {
  onLogoutCallback?: (timestamp: number) => void;
}

export const LogoutButton = (props: IProps) => {
  const onLogout = async () => {
    await Taro.clearStorageSync();

    await Taro.showToast({ title: '登出成功' });

    if (props.onLogoutCallback) {
      props.onLogoutCallback(new Date().getTime());
    }
  };

  return (
    <Button className={style['logout-button']} onClick={onLogout}>
      登出
    </Button>
  );
};
