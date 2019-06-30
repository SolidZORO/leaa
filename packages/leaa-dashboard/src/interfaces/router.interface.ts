import React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

export interface IRouteItem extends RouteProps {
  name: string;
  path: string;
  //
  icon?: string;
  isGroup?: boolean; // gropu of sidebar, not into rotues (flatMenu).
  groupName?: string;
  canCreate?: boolean;
  isCreate?: boolean;
  hasParam?: boolean;
  exact?: boolean;
  children?: IRouteItem[];
  LazyComponent?: React.LazyExoticComponent<React.FunctionComponent<RouteComponentProps>>;
}
