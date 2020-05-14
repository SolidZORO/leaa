import axios from 'axios';

import { getAuthToken } from './auth.util';
import { errorMsg } from './msg.util';
// import { xEditorDataset } from '@/configs';

export const ajax = axios;
ajax.defaults.timeout = 10000;

ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
ajax.defaults.headers.common.Authorization = getAuthToken() ? `Bearer ${getAuthToken()}` : '';

// ajax.interceptors.request.use(
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
// ajax.interceptors.response.use(
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
  ajax.defaults.headers.common.Authorization = `Bearer ${token}`;
  console.log('🔑 Token is Updated.');
};
