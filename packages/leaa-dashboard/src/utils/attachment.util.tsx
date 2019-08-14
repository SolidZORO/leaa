import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import uuid from 'uuid';
import { message } from 'antd';
import { Translation } from 'react-i18next';

import { ISaveInOssSignature, ISaveInLocalSignature, IAttachmentParams } from '@leaa/common/interfaces';
import { authUtil } from '@leaa/dashboard/utils/auth.util';
import { envConfig } from '@leaa/dashboard/configs';

// interface IProps {
//   value?: number | undefined;
//   attachmentParams: IAttachmentParams;
//   onUploadedCallback?: (uploaded: number) => void;
// }

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
  const signatureResult: ISignatureResult = await axios.get(`${envConfig.API_HOST}/attachments/signature`);

  if (!signatureResult || !signatureResult.data || !signatureResult.data || !signatureResult.data.uploadEndPoint) {
    message.error(<Translation>{t => t('_lang:uploadError')}</Translation>);
  }

  return signatureResult;
};

const uploadFile = (
  file: File,
  signatureResult: ISignatureResult,
  attachmentParams: any,
  onCallback?: {
    onUploadSuccess?: (event: any) => void;
    onUploadFail?: (event: any) => void;
    onUploadProgress?: (event: any) => void;
  },
) => {
  const token = authUtil.getAuthToken();
  const formData = new FormData();

  //
  // -------- LOCAL --------
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
      onUploadProgress: e => {
        if (onCallback && onCallback.onUploadProgress) {
          onCallback.onUploadProgress(e);
        }
      },
    })
    .then(e => {
      if (e.status === 203) {
        message.error('Callback Failed');

        return;
      }

      if (e.status !== 200) {
        message.error(e.statusText);

        return;
      }

      message.success(<Translation>{t => t('_lang:uploadSuccessfully')}</Translation>);

      if (onCallback && onCallback.onUploadSuccess) {
        // onCallback.onUploadSuccess(new Date().getMilliseconds());
        onCallback.onUploadSuccess(e);
      }
    })
    .catch((e: Error) => {
      message.info(e.message);

      if (onCallback && onCallback.onUploadFail) {
        onCallback.onUploadFail(e);
      }
    });
};

// const batchUploadFiles = async (fileList: File[] | File, props: IProps) => {
//   const signatureResult: {
//     data: ISaveInOssSignature | ISaveInLocalSignature;
//   } = await axios.get(`${envConfig.API_HOST}/attachments/signature`);
//
//   if (!signatureResult || !signatureResult.data || !signatureResult.data || !signatureResult.data.uploadEndPoint) {
//     message.error(<Translation>{t => t('_lang:uploadError')}</Translation>);
//
//     return;
//   }
//
//   const { uploadEndPoint, saveIn } = signatureResult.data;
//
//   //
//   //
//
//   // const uploadFile = (file: File) => {
//   //   const token = authUtil.getAuthToken();
//   //   const formData = new FormData();
//   //
//   //   //
//   //   // -------- LOCAL --------
//   //   if (saveIn === 'oss') {
//   //     const saveFilename = getSaveFilename(file.name);
//   //     const attachmentParamsSnakeCase: {} = {};
//   //
//   //     _.forEach(props.attachmentParams, (v, k) => {
//   //       // @ts-ignore https://help.aliyun.com/document_detail/31989.html
//   //       attachmentParamsSnakeCase[`x:${_.snakeCase(k)}`] = v;
//   //     });
//   //
//   //     _.map({ ...signatureResult.data, ...attachmentParamsSnakeCase }, (v, k) => formData.append(k, `${v}`));
//   //
//   //     // eslint-disable-next-line no-template-curly-in-string
//   //     formData.append('x:originalname', file.name);
//   //     formData.append('success_action_status', '200');
//   //     formData.append('key', `${signatureResult.data.saveDirPath}${saveFilename}`);
//   //   }
//   //
//   //   //
//   //   // -------- LOCAL --------
//   //   if (saveIn === 'local') {
//   //     _.map({ ...signatureResult.data, ...props.attachmentParams }, (v, k) => formData.append(k, `${v}`));
//   //   }
//   //
//   //   formData.append('file', file);
//   //
//   //   return axios
//   //     .post(uploadEndPoint, formData, {
//   //       headers: { Authorization: token ? `Bearer ${token}` : '' },
//   //     })
//   //     .then(e => {
//   //       if (e.status === 203) {
//   //         message.error('Callback Failed');
//   //
//   //         return;
//   //       }
//   //
//   //       if (e.status !== 200) {
//   //         message.error(e.statusText);
//   //
//   //         return;
//   //       }
//   //
//   //       message.success(<Translation>{t => t('_lang:uploadSuccessfully')}</Translation>);
//   //
//   //       if (props.onUploadedCallback) {
//   //         props.onUploadedCallback(new Date().getMilliseconds());
//   //       }
//   //     })
//   //     .catch((e: Error) => {
//   //       message.info(e.message);
//   //     });
//   // };
//
//   if (Array.isArray(fileList) && fileList.length > 0) {
//     fileList.forEach((file: File) => uploadFile(file));
//   }
//
//   if (!Array.isArray(fileList)) {
//     await uploadFile(fileList);
//   }
// };

export const attachmentUtil = {
  isAt2x,
  getSaveFilename,
  getSignature,
  uploadFile,
};
