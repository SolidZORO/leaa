declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

// eslint-disable-next-line no-underscore-dangle
declare const __SERVER_USER_AGENT__: string;

declare module 'next-nprogress/*';
