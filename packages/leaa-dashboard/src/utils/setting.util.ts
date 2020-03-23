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

const getSetting = (params: { key: string; disableNotification?: boolean }): ISetting => {
  const settingByEerrorTips: ISetting = {
    name: '',
    slug: '',
    value: '',
  };
  const settingsByEmpty: ISetting[] = [settingByEerrorTips];
  const settingsByLs = localStorage.getItem('settings');
  const settings = settingsByLs ? (JSON.parse(settingsByLs) as ISetting[]) : settingsByEmpty;

  const setting = settings.find((t) => t.slug === params.key);

  if (!setting) {
    if (!params.disableNotification) {
      notification.error({ message: `setting  ${params.key} not  found` });
    }

    return settingByEerrorTips;
  }

  return setting;
};

export const settingUtil = {
  refreshLocalStorageSettings,
  getSetting,
};
