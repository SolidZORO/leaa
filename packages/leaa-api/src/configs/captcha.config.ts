import { ConfigObject } from 'svg-captcha';

const SVG_CAPTCHA: ConfigObject = {
  noise: 3,
  size: 4,
  ignoreChars: '0Oo1IilL2Zz9qQ',
  width: 100,
  height: 32,
  // color: true,
  // background: '#cc9966',
};

export const captchaConfig = {
  SVG_CAPTCHA,
};
