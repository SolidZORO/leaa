// for layout className of full-wrap className
const routerPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

export const urlUtil = {
  routerPathToClassName,
};
