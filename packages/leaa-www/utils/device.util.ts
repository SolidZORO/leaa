import UAParser from 'ua-parser-js';
// import UniversalUserAgent from 'universal-user-agent';
// import useragent from 'useragent';

// const userAgent = UniversalUserAgent();

// console.log(userAgent);

// import { Response } from 'express';
// import Router from 'next/router';

const isServer = () => typeof window === 'undefined';
const isClient = () => typeof window !== 'undefined';

const getUserAgent = () => {
  // @ts-ignore
  const uaParser = new UAParser();

  // const debug = true;
  const debug = false;

  if (isServer()) {
    // eslint-disable-next-line no-undef
    uaParser.setUA(__SERVER_USER_AGENT__ || '');
  } else {
    if (debug) {
      console.log('__CLIENT_USER_AGENT__', window.navigator.userAgent);
    }

    uaParser.setUA(window.navigator.userAgent || '');
  }

  if (debug) {
    console.log('__UA__', uaParser.getResult());
  }

  return uaParser.getResult();
};

const isWechat = () => {
  const ua = getUserAgent().ua.toLowerCase();

  return /micromessenger/.test(ua);
};

const isChrome = () => {
  const ua = getUserAgent();

  return ua.browser && ua.browser.name && ua.browser.name === 'Chrome';
};

const isSupportWebp = () => {
  if (isServer()) {
    // Server
    const ua = getUserAgent();

    return ua.browser && ua.browser.name && ua.browser.name === 'Chrome' && ua.os && ua.os.name && ua.os.name !== 'iOS';
  }

  // Client
  const canvas: any = typeof document === 'object' ? document.createElement('canvas') : {};

  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;
};

export const deviceUtil = {
  isWechat,
  isChrome,
  isSupportWebp,
  isClient,
  isServer,
  getUserAgent,
};
