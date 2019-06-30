import { RouteComponentProps } from 'react-router-dom';
import { IRouteItem } from './router.interface';

export interface IPage extends RouteComponentProps {
  route: IRouteItem;
}
