import { IBuild } from '@leaa/dashboard/src/interfaces';

const buildDataEl = document.getElementById('__BUILD_DATA__');

// ./packages/leaa-dashboard/tools/webpack/_webpack_plugin.js - outputHtmlOption - build
export const buildConfig: IBuild = buildDataEl ? JSON.parse(atob(buildDataEl.innerHTML)) : {};
