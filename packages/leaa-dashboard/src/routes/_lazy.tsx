import React from 'react';
import lazyLib from 'react-imported-component';

import { Spinner } from '@leaa/dashboard/src/components';

export const lazy = (component: any) =>
  lazyLib(component, {
    LoadingComponent: Spinner,
  });
