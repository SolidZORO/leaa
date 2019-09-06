import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import { Oauth } from '@leaa/common/src/entrys';
import { IconFont } from '@leaa/miniprogram/src/components/IconFont';

import style from './style.less';

interface IProps {
  userInfo?: Oauth;
}

export const UserCard = (props: IProps) => {
  return (
    <View className={style['wrapper']}>
      <View className={style['card']}>
        {props.userInfo ? (
          <View className={style['card-inner']}>
            <View className={style['avatar']}>
              <Image src={props.userInfo.avatar_url} style={{ width: '64px', height: '64px', borderRadius: '100px' }} />
            </View>

            <View className={style['nickname']}>
              <Text className={style['nickname-text']}>{props.userInfo.nickname}</Text>
            </View>
          </View>
        ) : (
          <View className={style['card-inner']}>
            <IconFont type="x-account" size={76} color="#f1f1f1" />
          </View>
        )}
      </View>
    </View>
  );
};
