import React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

export interface IRouteMenu extends RouteProps {
  name: string;
  path: string;
  //
  icon?: string;
  isGroup?: boolean; // gropu of sidebar, not into rotues (flatMenu).
  canCreate?: boolean;
  isCreate?: boolean;
  hasParam?: boolean;
  exact?: boolean;
  children?: IRouteMenu[];
}

export interface IRouteItem extends IRouteMenu {
  LazyComponent: React.LazyExoticComponent<React.FunctionComponent<RouteComponentProps>>;
}
