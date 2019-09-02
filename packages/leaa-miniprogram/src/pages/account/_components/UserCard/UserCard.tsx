import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import { Oauth } from '@leaa/common/src/entrys';

import style from './style.less';

interface IProps {
  userInfo?: Oauth;
}

export const UserCard = (props: IProps) => {
  return (
    <View className={style['wrapper']}>
      <View className={style['card']}>
        {props.userInfo && (
          <View className={style['card-inner']}>
            <View className={style['avatar']}>
              <Image src={props.userInfo.avatar_url} style={{ width: '40px', height: '40px', borderRadius: '80px' }} />
            </View>

            <View className={style['nickname']}>
              <Text className={style['nickname-text']}>{props.userInfo.nickname}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
