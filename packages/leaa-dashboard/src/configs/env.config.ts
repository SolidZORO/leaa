import { IDotEnv } from '@leaa/dashboard/src/interfaces';

const envDataEl = document.getElementById('__ENV_DATA__');

export const envConfig: IDotEnv = envDataEl ? JSON.parse(envDataEl.innerHTML) : {};
