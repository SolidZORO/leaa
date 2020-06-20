import { RouteProps } from 'react-router-dom';

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
  isFn?: boolean;
  exact?: boolean;
  children?: IRouteItem[];
  LazyComponent?: any;
}
