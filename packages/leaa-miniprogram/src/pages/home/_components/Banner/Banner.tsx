import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';

import { GET_AX_BY_SLUG } from '@leaa/miniprogram/src/graphqls';
import { apolloClient } from '@leaa/miniprogram/src/libs';
import { AxArgs } from '@leaa/miniprogram/src/dtos/ax';
import { imageUtil } from '@leaa/miniprogram/src/utils';
import { Ax } from '@leaa/miniprogram/src/entrys';

import style from './style.less';

export const Banner = (props: any) => {
  const [getAxVariables, setGetAxVariables] = useState<AxArgs>({ slug: 'index-swiper' });
  const [getAxQuery, setGetAxQuery] = useState<{ axBySlug: Ax }>();
  const [getAxLoading, setGetAxLoading] = useState<boolean>(false);

  useEffect(() => {
    setGetAxLoading(true);

    apolloClient
      .query({
        query: GET_AX_BY_SLUG,
        variables: getAxVariables,
        fetchPolicy: 'network-only',
      })
      .then(({ data, loading }) => {
        setGetAxQuery(data);
      })
      .catch(error => {
        console.log('CATCH');

        console.error(error);
      })
      .finally(() => {
        setGetAxLoading(false);
      });
  }, [getAxVariables]);

  return (
    <View className={style['wrapper']}>
      {getAxQuery &&
        getAxQuery.axBySlug &&
        getAxQuery.axBySlug.attachments &&
        getAxQuery.axBySlug.attachments.bannerMbList && (
          <Swiper
            circular
            indicatorDots
            autoplay
            indicatorActiveColor="#aaaaaa"
            className={style['swiper-wrapper']}
            style={{
              height: `${imageUtil.calcImageHeight(
                getAxQuery.axBySlug.attachments.bannerMbList[0].width,
                getAxQuery.axBySlug.attachments.bannerMbList[0].height,
              )}px`,
            }}
          >
            {getAxQuery.axBySlug.attachments.bannerMbList.map(banner => (
              <SwiperItem key={banner.uuid} className={style['swiper-item']}>
                <Image
                  className={style['swiper-img']}
                  src={banner.url || ''}
                  mode="aspectFit"
                  style={{
                    height: `${imageUtil.calcImageHeight(banner.width, banner.height)}px`,
                  }}
                />
              </SwiperItem>
            ))}
          </Swiper>
        )}
    </View>
  );
};
