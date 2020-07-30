import _ from 'lodash';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'antd';

import { IAttachmentParams, IAutoUpdateRelation } from '@leaa/api/src/interfaces';
import { Attachment } from '@leaa/api/src/entrys';

import { fetcher } from '@leaa/dashboard/src/libs';
import { removeLangSpace, genCrudRequestQuery, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { FormCard } from '@leaa/dashboard/src/components';
import { IHttpRes, ICrudListRes, ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';

import { AttachmentList } from './_components/AttachmentList/AttachmentList';
import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';

import style from './style.module.less';

interface IProps {
  attachments?: Attachment[];
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
  onSubmitCallback?: (v: any) => void;
  type?: 'list' | 'card';
  title?: React.ReactNode;
  listHeight?: number;
  cardHeight?: number;
  className?: string;
  circle?: boolean;
  ignoreMsg?: boolean;
  onChangeAttasCallback?: (attachment: Attachment[]) => void;
  onDeleteAttaCallback?: () => void;
  autoUpdateRelation?: IAutoUpdateRelation;
}

/**
 * AttachmentBox
 *
 * @ideaNotes
 * 我的想法是这样的，AttachmentBox（下文叫 ABOX）只管上传文件，传完写入 AttachmentTable。
 *
 * 下面是 attachmentParams 范例（ajax get 那边会配合 genCrudRequestQuery 做 search）
 * {
 *    type: 'image',
 *    moduleId: item?.id,
 *    moduleName: 'ax',
 *    typeName: 'gallery',
 *    typePlatform: 'pc',
 * }
 *
 * 你传什么 attachmentParams，那么 AttachmentTable 就存什么，把权利完全交给 ABOX 控制
 * 所以每个 ABOX 都是独立的，有几个 ABOX 就意味着这个页面要发几个 ajax 过去 fetchList，而不是 API 那边事先 query 好丢出来。
 *
 * 之前想着给 moduleTable <--> attachmentTable 做 M2M 关联表，
 * 但这样其实有个问题，当一个页面有多个 ABOX 的时候，每次 POST 这个 M2M 的时候还要把所有 ABOX 的 data 拿出来合并一起 POST，
 * 因为如果不这样做会破坏 M2M 关系，想来想去，还是去掉 M2M，这样才有了上面的想法，让写（Write）这一步更自由，让查（Read）也更灵活。
 */
export const AttachmentBox = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const isAjaxCancelled = useRef(false);

  const type = props.type || 'list';
  const cardHeight = props.cardHeight || 230;
  const listHeight = props.listHeight || 130;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [attachmentParams, setAttachmentParams] = useState<IAttachmentParams>(props.attachmentParams);

  const onFetchList = (attaParams: IAttachmentParams) => {
    if (!attaParams || !attaParams.moduleId) return;

    setListLoading(true);

    const params: ICrudListQueryParams = {
      search: {
        module_id: attaParams.moduleId,
        module_name: attaParams.moduleName,
        type_name: attaParams.typeName,
        type_platform: attaParams.typePlatform,
      },
      sort: [
        ['status', 'DESC'],
        ['sort', 'ASC'],
      ],
    };

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<Attachment>>) => {
        if (!isAjaxCancelled.current) {
          setAttachments(_.orderBy(res.data.data.data, ['status', 'sort'], ['desc', 'asc']) || []);
        }
      })
      .catch(httpErrorMsg)
      .finally(() => !isAjaxCancelled.current && setListLoading(false));
  };

  useEffect(() => {
    if (props.attachmentParams?.moduleId && !attachmentParams.moduleId) {
      setAttachmentParams(props.attachmentParams);
      onFetchList(props.attachmentParams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.attachmentParams]);

  useEffect(() => {
    return () => {
      isAjaxCancelled.current = true;
    };
  }, []);

  const onChangeAttas = (attas: Attachment[]) => {
    setAttachments(_.orderBy(attas, ['status', 'sort'], ['desc', 'asc']) || []);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/batch`, { attachments: attas })
      .then(() => {
        // 这里没必要去拿 res 的 data 然后再设定
        if (props.onChangeAttasCallback) props.onChangeAttasCallback(attas);
        if (props.onDeleteAttaCallback) props.onDeleteAttaCallback();
      })
      .catch(httpErrorMsg);
  };

  const onDeletedAtta = (atta: Attachment) => onChangeAttas(attachments?.filter((a) => a.id !== atta.id));
  const onDropzoneAttas = (attas: Attachment[]) => onChangeAttas(attachments?.concat(attas));

  return (
    <div
      className={cx(style['attachment-box-comp-wrapper'], props.className, {
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
              arrowPointAtCenter
              title={
                <code className={style['title-code-tooltip']}>
                  {props.attachmentParams?.type}-{props.attachmentParams?.moduleName}-{props.attachmentParams?.typeName}
                  <br />
                  <small>{props.attachmentParams?.moduleId}</small>
                </code>
              }
              trigger="hover"
            >
              <code className={style['title-code-text']}>
                {props.attachmentParams?.typeName}
                <small>{props.attachmentParams?.typePlatform}</small>
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
          loading={listLoading}
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
