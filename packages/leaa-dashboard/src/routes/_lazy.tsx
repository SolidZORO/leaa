import React from 'react';
import lazyLib from '@loadable/component';

import { Spinner } from '@leaa/dashboard/src/components';

// @ts-ignore
export const lazy = (component: any) => lazyLib(component, { fallback: <Spinner /> });
