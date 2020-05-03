import gql from 'graphql-tag';

import { SETTING_FRAGMENT } from './setting.fragment';

export const CREATE_SETTING = gql`
  mutation($setting: CreateSettingInput!) {
    createSetting(setting: $setting) {
      ...SETTING_FRAGMENT
    }
  }
  ${SETTING_FRAGMENT}
`;

export const UPDATE_SETTING = gql`
  mutation($id: String!, $setting: UpdateSettingInput!) {
    updateSetting(id: $id, setting: $setting) {
      ...SETTING_FRAGMENT
    }
  }
  ${SETTING_FRAGMENT}
`;

export const UPDATE_SETTINGS = gql`
  mutation($settings: [UpdateSettingsInput!]!) {
    updateSettings(settings: $settings) {
      items {
        id
        value
      }
    }
  }
`;

export const DELETE_SETTING = gql`
  mutation($id: String!) {
    deleteSetting(id: $id) {
      id
      name
    }
  }
`;
