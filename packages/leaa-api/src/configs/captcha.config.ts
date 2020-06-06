import path from 'path';
import { ConfigObject } from 'svg-captcha';

const SVG_CAPTCHA_OPTION: ConfigObject = {
  noise: 3,
  size: 4,
  ignoreChars: '0Oo1IilL2Zz9qQ',
  width: 100,
  height: 30,
  fontSize: 32,
  // color: true,
  // background: '#cc9966',
};

const FONT_DIR = path.resolve(__dirname, '../assets/fonts');
const SVG_CAPTCHA_FONT_PATH = `${FONT_DIR}/halva.otf`;

export const captchaConfig = {
  SVG_CAPTCHA_OPTION,
  SVG_CAPTCHA_FONT_PATH,
};
