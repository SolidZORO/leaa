import { IDotEnv } from '@leaa/dashboard/src/interfaces';

const envDataEl = document.getElementById('__ENV_DATA__');
const envElData = envDataEl ? JSON.parse(atob(envDataEl.innerHTML)) : {};

const envData: { [key: string]: string | boolean } = {};

Object.keys(envElData).forEach(k => {
  if (envElData[k] && ['false', 'true'].includes(envElData[k])) {
    envData[k] = Boolean(envElData[k] === 'true');
  } else {
    envData[k] = envElData[k];
  }
});

// @ts-ignore
export const envConfig: IDotEnv = envData;
