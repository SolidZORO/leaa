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
  mutation($id: Int!, $setting: UpdateSettingInput!) {
    updateSetting(id: $id, setting: $setting) {
      ...SETTING_FRAGMENT
    }
  }
  ${SETTING_FRAGMENT}
`;

export const DELETE_SETTING = gql`
  mutation($id: Int!) {
    deleteSetting(id: $id) {
      id
      name
    }
  }
`;
