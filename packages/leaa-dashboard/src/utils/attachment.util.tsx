import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import * as uuid from 'uuid';
// import { message } from 'antd';
import { Translation } from 'react-i18next';

import { ISaveInOssSignature, ISaveInLocalSignature } from '@leaa/common/src/interfaces';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';

import { ajax } from './ajax.util';
import { errorMsg, msg } from './msg.util';
import { getAuthToken } from './auth.util';

declare type ISignatureResult = ISaveInOssSignature | ISaveInLocalSignature | undefined;

export const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

export const getSaveFilename = (originalname: string): string => {
  const at2x = isAt2x(originalname) ? '_2x' : '';
  const ext = originalname.split('.').pop();

  return `${uuid.v4()}${at2x}.${ext}`;
};

export const getUploadSignature = async () => {
  return ajax
    .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/signature`)
    .then((res: IHttpRes<ISignatureResult>) => {
      console.log(res.data.data);

      if (res.data?.data && !_.isEmpty(res.data.data)) return res.data.data;

      return undefined;
    })
    .catch((err: IHttpError) => {
      // console.log(err.response?.data?.message || err.message);
      errorMsg(err.response?.data?.message || err.message);
    });
};

interface IUploadFile {
  signature: ISignatureResult;
  attachmentParams: any;
  ignoreMsg?: boolean;
  onCallback?: {
    onUploadSuccess?: (event: any) => void;
    onUploadProgress?: (event: any) => void;
    onUploadFail?: (event: any) => void;
    onUploadCatch?: (event: any) => void;
  };
}
export const uploadFile = (file: File, { signature, ignoreMsg, attachmentParams, onCallback }: IUploadFile) => {
  // const token = getAuthToken();
  const formData = new FormData();

  //
  // -------- OSS --------
  if (signature?.saveIn === 'oss') {
    const saveFilename = getSaveFilename(file.name);
    const attachmentParamsSnakeCase: {} = {};

    _.forEach(attachmentParams, (v, k) => {
      // @ts-ignore https://help.aliyun.com/document_detail/31989.html
      attachmentParamsSnakeCase[`x:${_.snakeCase(k)}`] = v;
    });

    _.map({ ...signature, ...attachmentParamsSnakeCase }, (v, k) => formData.append(k, `${v}`));

    // eslint-disable-next-line no-template-curly-in-string
    formData.append('x:originalname', file.name);
    formData.append('success_action_status', '200');
    formData.append('key', `${signature?.saveDirPath}${saveFilename}`);
  }

  //
  // -------- LOCAL --------
  if (signature?.saveIn === 'local') {
    _.map({ ...signature, ...attachmentParams }, (v, k) => formData.append(k, `${v}`));
  }

  formData.append('file', file);

  if (!signature?.uploadEndPoint) return errorMsg('missing uploadEndPoint');

  return ajax
    .post(signature?.uploadEndPoint, formData, {
      onUploadProgress: (e) => {
        if (onCallback && onCallback.onUploadProgress) onCallback.onUploadProgress(e);
      },
    })
    .then((response) => {
      if (response.status === 203) {
        errorMsg('Callback Failed');

        if (onCallback && onCallback.onUploadFail) {
          onCallback.onUploadFail(response);
        }

        return;
      }

      if (response.status !== 200) {
        errorMsg(response.statusText);

        return;
      }

      if (ignoreMsg) msg(<Translation>{(t) => t('_lang:uploadSuccessfully')}</Translation>);
      if (onCallback && onCallback.onUploadSuccess) onCallback.onUploadSuccess(response);
    })
    .catch((err: Error) => {
      console.log(`uploadFile Error (${signature?.saveIn})`, err);
      errorMsg(err.message);

      if (onCallback && onCallback.onUploadCatch) onCallback.onUploadCatch(err);
    });
};
