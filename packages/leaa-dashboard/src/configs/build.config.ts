import { IBuild } from '@leaa/dashboard/src/interfaces';

const buildDataEl = document.getElementById('__BUILD_DATA__');

export const buildConfig: IBuild = buildDataEl ? JSON.parse(atob(buildDataEl.innerHTML)) : {};
