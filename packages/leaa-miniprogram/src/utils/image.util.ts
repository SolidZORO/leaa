import Taro from '@tarojs/taro';

const calcImageHeight = (imageWidth: number, imageHeigh: number): number => {
  // 1 - imageWidth / imageHeigh = WHP (width height proportionality)
  // 2 - screenWidth / WHP
  const WHP = imageWidth / imageHeigh;

  return parseInt(String(Taro.getSystemInfoSync().screenWidth / WHP), 10);
};

export const imageUtil = {
  calcImageHeight,
};
