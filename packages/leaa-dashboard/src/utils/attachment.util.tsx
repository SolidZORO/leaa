import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import * as uuid from 'uuid';
import { message } from 'antd';
import { Translation } from 'react-i18next';

import { ISaveInOssSignature, ISaveInLocalSignature } from '@leaa/common/src/interfaces';
import { authUtil } from '@leaa/dashboard/src/utils/auth.util';
import { envConfig } from '@leaa/dashboard/src/configs';

interface ISignatureResult {
  data: ISaveInOssSignature | ISaveInLocalSignature;
}

const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

const getSaveFilename = (originalname: string): string => {
  const at2x = isAt2x(originalname) ? '_2x' : '';
  const ext = originalname.split('.').pop();

  return `${uuid.v4()}${at2x}.${ext}`;
};

const getSignature = async () => {
  const signatureResult: ISignatureResult = await axios.get(`${envConfig.API_URL}/attachments/signature`);

  if (!signatureResult || !signatureResult.data || !signatureResult.data || !signatureResult.data.uploadEndPoint) {
    message.error(<Translation>{(t) => t('_lang:uploadError')}</Translation>);
  }

  return signatureResult;
};

const uploadFile = (
  file: File,
  signatureResult: ISignatureResult,
  attachmentParams: any,
  onCallback?: {
    onUploadSuccess?: (event: any) => void;
    onUploadProgress?: (event: any) => void;
    onUploadFail?: (event: any) => void;
    onUploadCatch?: (event: any) => void;
  },
) => {
  const token = authUtil.getAuthToken();
  const formData = new FormData();

  //
  // -------- OSS --------
  if (signatureResult.data.saveIn === 'oss') {
    const saveFilename = getSaveFilename(file.name);
    const attachmentParamsSnakeCase: {} = {};

    _.forEach(attachmentParams, (v, k) => {
      // @ts-ignore https://help.aliyun.com/document_detail/31989.html
      attachmentParamsSnakeCase[`x:${_.snakeCase(k)}`] = v;
    });

    _.map({ ...signatureResult.data, ...attachmentParamsSnakeCase }, (v, k) => formData.append(k, `${v}`));

    // eslint-disable-next-line no-template-curly-in-string
    formData.append('x:originalname', file.name);
    formData.append('success_action_status', '200');
    formData.append('key', `${signatureResult.data.saveDirPath}${saveFilename}`);
  }

  //
  // -------- LOCAL --------
  if (signatureResult.data.saveIn === 'local') {
    _.map({ ...signatureResult.data, ...attachmentParams }, (v, k) => formData.append(k, `${v}`));
  }

  formData.append('file', file);

  return axios
    .post(signatureResult.data.uploadEndPoint, formData, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
      onUploadProgress: (e) => {
        if (onCallback && onCallback.onUploadProgress) {
          onCallback.onUploadProgress(e);
        }
      },
    })
    .then((response) => {
      if (response.status === 203) {
        message.error('Callback Failed');

        if (onCallback && onCallback.onUploadFail) {
          onCallback.onUploadFail(response);
        }

        return;
      }

      if (response.status !== 200) {
        message.error(response.statusText);

        return;
      }

      message.success(<Translation>{(t) => t('_lang:uploadSuccessfully')}</Translation>);

      if (onCallback && onCallback.onUploadSuccess) {
        onCallback.onUploadSuccess(response);
      }
    })
    .catch((error: Error) => {
      message.info(error.message);

      if (onCallback && onCallback.onUploadCatch) {
        onCallback.onUploadCatch(error);
      }
    });
};

export const attachmentUtil = {
  isAt2x,
  getSaveFilename,
  getSignature,
  uploadFile,
};
