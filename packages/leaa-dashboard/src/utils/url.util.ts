import queryString from 'query-string';

// newUrl = paramList CHANGE string + rawUrlQuery
const mergeParamToUrlQuery = (object: { window: any; paramList: Object | undefined; replaceUrl: boolean }) => {
  const currentUrl = `${object.window.location.origin}${object.window.location.pathname}`;

  let urlQuery;

  if (object.paramList) {
    urlQuery = queryString.stringify(object.paramList);
  }

  urlQuery = urlQuery ? `?${urlQuery}` : urlQuery;

  const url = `${currentUrl}${urlQuery}`;

  if (object.replaceUrl) {
    window.history.pushState(null, '', url);
  }

  return url;
};

export const urlUtil = {
  mergeParamToUrlQuery,
};
