/* eslint-disable */
declare module 'react-navigation-tabs' {
  import {
    NavigationStackScreenOptions,
    NavigationStackConfig,
    Screen,
    // @ts-ignore
  } from 'react-navigation-stack/lib/typescript/types.d.ts';

  function createBottomTabNavigator(
    routeConfigMap: {
      [key: string]:
        | Screen
        | ((
            | {
                screen: Screen;
              }
            | {
                getScreen(): Screen;
              }
          ) & {
            path?: string;
            navigationOptions?: NavigationStackScreenOptions;
            params?: {
              [key: string]: any;
            };
          });
    },
    stackConfig?: NavigationStackConfig & {
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
    },
  ):
    | (import('react').ComponentClass<any, any> & {
        router: any;
      })
    | (import('react').FunctionComponent<any> & {
        router: any;
      });
}

// declare module 'react-navigation-tabs';
declare module 'react-native-tiny-toast';
declare module 'teaset';
