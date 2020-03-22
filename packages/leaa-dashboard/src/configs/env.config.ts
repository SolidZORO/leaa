import { IDotEnv } from '@leaa/dashboard/src/interfaces';

const envDataEl = document.getElementById('__ENV_DATA__');
const envElData = envDataEl ? JSON.parse(atob(envDataEl.innerHTML)) : {};

Object.keys(envElData).forEach((k) => {
  if (envElData[k] && ['false', 'true'].includes(envElData[k])) {
    envElData[k] = Boolean(envElData[k] === 'true');
  }
});

export const envConfig: IDotEnv = envElData;
