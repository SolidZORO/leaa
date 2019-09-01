declare module 'react-navigation-tabs' {
  import { NavigationStackScreenOptions, NavigationStackConfig, Screen } from 'react-navigation-stack/lib/typescript/types.d.ts';

  declare function createBottomTabNavigator(routeConfigMap: {
    [key: string]: Screen | (({
      screen: Screen;
    } | {
      getScreen(): Screen;
    }) & {
      path?: string;
      navigationOptions?: NavigationStackScreenOptions;
      params?: {
        [key: string]: any;
      };
    });
  }, stackConfig?: NavigationStackConfig & {
    initialRouteName?: string;
    initialRouteParams?: {
      [key: string]: any;
    };
    paths?: {
      [routeName: string]: string;
    };
    defaultNavigationOptions?: NavigationStackScreenOptions;
    navigationOptions?: NavigationStackScreenOptions;
    initialRouteKey?: string;
  }): (import("react").ComponentClass<any, any> & {
    router: any;
  }) | (import("react").FunctionComponent<any> & {
    router: any;
  });
}
