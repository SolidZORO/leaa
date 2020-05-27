import _ from 'lodash';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';

import { IAttachmentParams } from '@leaa/common/src/interfaces';
import { Attachment } from '@leaa/common/src/entrys';

import { removeLangSpace, ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { FormCard } from '@leaa/dashboard/src/components';
import { IHttpError } from '@leaa/dashboard/src/interfaces';

import { AttachmentList } from './_components/AttachmentList/AttachmentList';
import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';

import style from './style.module.less';

interface IProps {
  attachments?: Attachment[];
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams?: IAttachmentParams;
  onSubmitCallback?: (v: any) => void;
  type?: 'list' | 'card';
  title?: React.ReactNode;
  disableMessage?: boolean;
  listHeight?: number;
  cardHeight?: number;
  className?: string;
  circle?: boolean;
  onDeleteAttaCallback?: (attachment: Attachment[]) => void;
  onChangeAttasCallback?: (attachment: Attachment[]) => void;
}

/**
 * AttachmentBox
 *
 * @ideaNotes
 * 我的想法是这样的，组建只管上传文件，传完 Effect 抛出来一些 Attachments Ids，给上游 Item 提交
 *  - Success 成功
 *    这样 API 那边 ManyToMany 就会成功的把 Item.id 和 Atta.id 绑一起，relation 的时候能查出来
 *
 *  - Fiald 失败（或上游 Item 没保存）
 *    文件和数据还是会在 Disk 和 DB，但是没有 module_id，如果需要清理文件，可以把这些没有 id 的清理掉
 */
export const AttachmentBox = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const type = props.type || 'list';
  const cardHeight = props.cardHeight || 230;
  const listHeight = props.listHeight || 130;

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const onChangeAttas = (attas: Attachment[]) => {
    setAttachments(attas);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/batch`, { attachments: attas })
      .then(() => {
        if (props.onChangeAttasCallback) props.onChangeAttasCallback(attas);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message));
  };

  const onDropzoneAttas = (attas: Attachment[]) => {
    onChangeAttas(attachments?.concat(attas));
  };

  const onDeletedAtta = (atta: Attachment) => {
    onChangeAttas(attachments?.filter((a) => a.id !== atta.id));
  };

  useEffect(() => {
    if (props.attachments) setAttachments(_.orderBy(props.attachments, 'sort', 'asc'));
  }, [props.attachments]);

  return (
    <div
      className={cx(style['attachment-box-wrapper'], props.className, {
        [style['wrapper-box--list']]: type === 'list',
        [style['wrapper-box--card']]: type === 'card',
        [style['wrapper-box--circle']]: props.circle,
      })}
      style={{ height: type === 'card' ? cardHeight : undefined }}
    >
      <FormCard
        title={
          <>
            {props.title ||
              removeLangSpace(
                `${t('_lang:attachment')} ${type === 'list' ? t('_lang:list') : t('_lang:card')}`,
                i18n.language,
              )}

            <Tooltip
              title={
                <code className={style['title-code-tooltip']}>
                  {props.attachmentParams?.type}-{props.attachmentParams?.moduleName}-{/* prettier-ignore */}
                  {props.attachmentParams?.typeName}-{props.attachmentParams?.moduleId}
                </code>
              }
              trigger="hover"
            >
              <code className={style['title-code-text']}>
                {props.attachmentParams?.typeName}
                <small>{props.attachmentParams?.typePlatform}</small>
                <small>{props.attachmentParams?.moduleId}</small>
              </code>
            </Tooltip>
          </>
        }
      >
        <AttachmentDropzone
          attachmentParams={props.attachmentParams}
          onDropzoneAttasCallback={onDropzoneAttas}
          attachments={attachments}
          type={type}
          cardHeight={cardHeight}
          circle={props.circle}
        />

        <AttachmentList
          attachmentParams={props.attachmentParams}
          attachments={attachments}
          onDeleteAttaCallback={onDeletedAtta}
          onChangeAttasCallback={onChangeAttas}
          type={type}
          listHeight={listHeight}
          cardHeight={cardHeight}
          circle={props.circle}
        />
      </FormCard>
    </div>
  );
};
