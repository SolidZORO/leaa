import { Response } from 'express';
import Router from 'next/router';

const isServer = typeof window === 'undefined';

const routerPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

const redirect = (to: string, res?: Response) => {
  if (isServer && res) {
    res.writeHead(302, { Location: to });
    res.end();
  } else {
    Router.push(to).then(() => null);
  }
};

export const urlUtil = {
  routerPathToClassName,
  redirect,
};
