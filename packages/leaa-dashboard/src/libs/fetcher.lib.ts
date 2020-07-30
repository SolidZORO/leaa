// eslint-disable-next-line import/no-named-default
import { default as axiosLib } from 'axios';

import { getAuthToken, getGuestToken } from '@leaa/dashboard/src/utils';

export const fetcher = axiosLib;

fetcher.defaults.timeout = 10000;

fetcher.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
fetcher.defaults.headers.common.Authorization = getAuthToken() ? `Bearer ${getAuthToken()}` : '';
fetcher.defaults.headers.common.Guthorization = getGuestToken();

// fetcher.interceptors.request.use(
//   (res) => {
//     // console.log('RRRRRRRR', res);
//
//     return res;
//   },
//   (err) => {
//     console.warn('❌ HTTP REQ ERROR', err);
//
//     // ERROR Normalify statusCode > 400
//     return Promise.resolve(err?.response);
//   },
// );
//
// fetcher.interceptors.response.use(
//   (res) => {
//     console.log('XXXXXXXX?????????/', res);
//
//     return res;
//   },
//   (err) => {
//     // FINALLY
//     console.warn('❌ HTTP RES ERROR', err);
//
//     errorMsg(err.message);
//
//     // TIMEOUT
//     if (err?.code === 'ECONNABORTED') {
//       // console.error('❌ HTTP RESPONSE TIMEOUT', error.response);
//
//       return {
//         data: err,
//         status: 'timeout',
//       };
//     }
//
//     // ERROR Normalify statusCode > 400
//     return Promise.resolve(err?.response);
//   },
// );

export const setAjaxToken = (token: string) => {
  fetcher.defaults.headers.common.Authorization = `Bearer ${token}`;
  console.log('🔑 Token is Updated.');
};
