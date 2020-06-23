import React from 'react';
import RIC from 'react-imported-component';

import { Spinner } from '@leaa/dashboard/src/components';

export const lazy = (component: any) =>
  RIC(component, {
    LoadingComponent: Spinner,
  });
