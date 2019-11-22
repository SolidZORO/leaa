import { notification } from 'antd';
import gql from 'graphql-tag';

import { ISetting } from '@leaa/dashboard/src/interfaces';
import { apolloClient } from '@leaa/dashboard/src/libs/apollo-client.lib';
import { SettingsWithPaginationObject } from '@leaa/common/src/dtos/setting';

export const GET_SETTINGS = gql`
  query {
    settings {
      total
      items {
        name
        slug
        value
      }
    }
  }
`;

const refreshLocalStorageSettings = () => {
  apolloClient
    .query<any>({
      query: GET_SETTINGS,
      variables: {},
      fetchPolicy: 'network-only',
    })
    .then((result: { data: { settings: SettingsWithPaginationObject } }) => {
      if (result && result.data.settings && result.data.settings.items) {
        localStorage.setItem('settings', JSON.stringify(result.data.settings.items));
      }
    });
};

const getSetting = (key: string): ISetting => {
  const settingByEerrorTips: ISetting = {
    name: 'ERROR-SETTING-NAME-TIPS',
    slug: 'ERROR-SETTING-SLUG-TIPS',
    value: 'ERROR-SETTING-VALUE-TIPS',
  };
  const settingsByEmpty: ISetting[] = [settingByEerrorTips];
  const settingsByLs = localStorage.getItem('settings');
  const settings = settingsByLs ? (JSON.parse(settingsByLs) as ISetting[]) : settingsByEmpty;

  const setting = settings.find(t => t.slug === key);

  if (!setting) {
    notification.error({ message: `setting  ${key} not  found` });

    return settingByEerrorTips;
  }

  return setting;
};

export const settingUtil = {
  refreshLocalStorageSettings,
  getSetting,
};
