import React from 'react';
import { RouteProps } from 'react-router-dom';

import { IPage } from '@leaa/dashboard/src/interfaces';

export interface IRouteItem extends RouteProps {
  name: string;
  path: string;
  permission: string;
  //
  namei18n?: string;
  icon?: string;
  isGroup?: boolean; // gropu of sidebar, not into rotues (flatMenu).
  groupName?: string;
  canCreate?: boolean;
  isCreate?: boolean;
  exact?: boolean;
  children?: IRouteItem[];
  LazyComponent?: React.LazyExoticComponent<React.FunctionComponent<IPage>>;
}
