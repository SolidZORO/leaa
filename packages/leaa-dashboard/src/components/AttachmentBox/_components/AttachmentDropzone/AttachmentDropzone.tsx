import _ from 'lodash';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { authUtil, attachmentUtil } from '@leaa/dashboard/utils';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Icon, message } from 'antd';

import { IAttachmentParams, ISaveInOssSignature, ISaveInLocalSignature } from '@leaa/common/interfaces';
import { envConfig } from '@leaa/dashboard/configs';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  attachmentParams: IAttachmentParams;
  onUploadedCallback?: (uploaded: number) => void;
}

export const AttachmentDropzone = (props: IProps) => {
  const { t } = useTranslation();
  const token = authUtil.getAuthToken();

  const onDrop = useCallback(async acceptedFiles => {
    const signatureResult: {
      data: ISaveInOssSignature | ISaveInLocalSignature;
    } = await axios.get(`${envConfig.API_HOST}/attachments/signature`);

    if (!signatureResult || !signatureResult.data || !signatureResult.data || !signatureResult.data.uploadEndPoint) {
      message.error(t('_lang:uploadError'));

      return;
    }

    const { uploadEndPoint, saveIn } = signatureResult.data;

    acceptedFiles.forEach((file: File) => {
      const formData = new FormData();

      //
      // -------- LOCAL --------
      if (saveIn === 'oss') {
        const saveFilename = attachmentUtil.getSaveFilename(file.name);
        const attachmentParamsSnakeCase: {} = {};

        _.forEach(props.attachmentParams, (v, k) => {
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
      if (saveIn === 'local') {
        _.map({ ...signatureResult.data, ...props.attachmentParams }, (v, k) => formData.append(k, `${v}`));
      }

      formData.append('file', file);

      axios
        .post(uploadEndPoint, formData, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        })
        .then(() => {
          message.success(t('_lang:uploadSuccessfully'));

          if (props.onUploadedCallback) {
            props.onUploadedCallback(new Date().getMilliseconds());
          }
        })
        .catch((e: Error) => {
          message.info(e.message);
        });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });
  const dropTipsDom = <Icon type="plus" className={style['file-icon']} />;

  return (
    <div {...getRootProps()} className={style['wrapper']}>
      <input {...getInputProps()} className={style['file-input']} />
      {isDragActive ? dropTipsDom : dropTipsDom}
    </div>
  );
};
