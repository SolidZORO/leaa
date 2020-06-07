import _ from 'lodash';
import React from 'react';
import * as uuid from 'uuid';
import { Translation } from 'react-i18next';

import { ISaveInOssSignature, ISaveInLocalSignature } from '@leaa/api/src/interfaces';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';

import { ajax } from './ajax.util';
import { errorMsg, msg } from './msg.util';

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

export const formatAttaUrl = (url?: string | null) => {
  if (!url) return 'DEFAULT-IMAGE.jpg';

  //   oss: https://oss.com/attas/abc.jpg
  // local: /attas/abc.jpg
  // if (/^http/.test(url)) return url;
  if (url.startsWith('http')) return url;

  return `${envConfig.API_URL}${url}`;
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

/**
 * uploadFile
 *
 * @ideaNotes
 * I was thinking about uploading the API where uploadEndPoint was sent, but putting it in the PROD environment does not
 * make sense, because the server does not know its own environment, It is very likely that the upstream of the API is a
 * layer of nginx proxy. Therefore, to determine if there is no `http`, use the API path defined by .env.
 *
 * 之前这里是想着 API 给什么 uploadEndPoint 就传到哪里，但放到 PROD 环境下，这样做其实没有意义，因为服务器自己也不知道自己的环境，
 * 很有可能 API 上游是一层 nginx proxy。 所以，这里要判断如果没有 `http`，就用 .env 定义的 API 路径。
 */
export const uploadFile = (file: File, { signature, ignoreMsg, attachmentParams, onCallback }: IUploadFile) => {
  if (!signature?.uploadEndPoint) return errorMsg('missing uploadEndPoint');

  // const token = getAuthToken();
  const formData = new FormData();

  // if saveIn === 'local', uploadEndPoint will return '/v1/attachments/upload'
  const nextUploadEndPoint =
    signature?.saveIn === 'local' ? `${envConfig.API_URL}${signature?.uploadEndPoint}` : signature?.uploadEndPoint;

  console.log('nextUploadEndPoint', nextUploadEndPoint);

  //
  // -------- OSS --------
  if (signature?.saveIn === 'oss') {
    const saveFilename = getSaveFilename(file.name);
    const attachmentParamsSnakeCase: any = {};

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

  //
  // -------- START UPLOAD --------
  formData.append('file', file);

  return ajax
    .post(nextUploadEndPoint, formData, {
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

      if (!ignoreMsg) msg(<Translation>{(t) => t('_lang:uploadSuccessfully')}</Translation>);
      if (onCallback && onCallback.onUploadSuccess) onCallback.onUploadSuccess(response);
    })
    .catch((err: Error) => {
      console.log(`uploadFile Error (${signature?.saveIn})`, err);
      errorMsg(err.message);

      if (onCallback && onCallback.onUploadCatch) onCallback.onUploadCatch(err);
    });
};
