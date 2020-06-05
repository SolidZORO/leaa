import _ from 'lodash';
import { notification } from 'antd';

import { ISetting, IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';
import { ajax } from '@leaa/dashboard/src/utils/ajax.util';
import { envConfig } from '@leaa/dashboard/src/configs';
import { Setting } from '@leaa/api/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils/msg.util';
import { genCrudRequestQuery } from '@leaa/dashboard/src/utils/crud.util';

export const refreshLocalStorageSettings = () => {
  ajax
    .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/settings`, {
      params: genCrudRequestQuery({ fields: ['name', 'slug', 'value'] }),
    })
    .then((res: IHttpRes<ICrudListRes<Setting>>) => {
      if (res.data?.data?.data && !_.isEmpty(res.data.data.data)) {
        const settings = res.data.data.data.map((s) => _.pick(s, ['name', 'slug', 'value']));
        localStorage.setItem('settings', JSON.stringify(settings));
      }
    })
    .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message));
};

export const getLocalStorageSettings = (params: { key: string; disableNotification?: boolean }): ISetting => {
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
