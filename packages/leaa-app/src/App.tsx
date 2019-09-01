import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useScreens } from 'react-native-screens';

import { AppBottomTabbar } from '@leaa/app/src/components/AppBottomTabbar';

// https://reactnavigation.org/docs/en/react-native-screens.html
useScreens();

export default () => <AppBottomTabbar />;
