import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { RiZoomInLine, RiHdLine } from 'react-icons/ri';

import { Input, Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { Draggable } from 'react-beautiful-dnd';

import { Attachment } from '@leaa/api/src/entrys';

import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { SwitchNumber, ConfirmDeleteButton } from '@leaa/dashboard/src/components';
import { envConfig } from '@leaa/dashboard/src/configs';

import { fetcher } from '@leaa/dashboard/src/libs';
import { errorMsg, formatAttaUrl } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  attachment: Attachment;
  index: number;
  onDeleteAttaCallback?: (attachment: Attachment) => void;
  onChangeAttaCallback?: (attachment: Attachment) => void;
  type?: 'list' | 'card';
  cardHeight?: number;
  circle?: boolean;
}

const grid = 4;
const getItemStyle = (isDragging: boolean, draggableStyle: React.CSSProperties | any) => ({
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '3px',
  backgroundColor: isDragging ? '#eee' : 'transparent',
  ...draggableStyle,
});

/**
 * 我淦！react-dnd 相关的代码怎么那么复杂 ？？？？
 * 它不是堪称 react libs 的典范吗？才两个月不看，我都搞不懂之前写的是什么了，又得去翻 docs
 *
 * @ideaNotes
 * 害，此时此刻，我并没有什么想法…… react-dnd 的 API 真不是人用的。妈的实在难受 😣。
 *
 * @ideaNotesUpdate 2020-05-28
 * WTF，今天忍不了了 换了 react-beautiful-dnd，一切都舒服了！！API 简简单单，代码可读性超好，libs 的选择实在太重要了。
 */
export const AttachmentItem = (props: IProps) => {
  const { t } = useTranslation();
  const cardHeight = (props.type === 'card' && props.cardHeight) || undefined;

  const [attachment, setAttachment] = useState<Attachment>(props.attachment);
  useEffect(() => setAttachment(props.attachment), [props.attachment]);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDelete = (id?: string) => {
    setDeleteLoading(true);

    fetcher
      .delete(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/${id}`)
      .then((res: IHttpRes<Attachment>) => {
        // msg(t('_lang:deletedSuccessfully', { id: res?.data?.data?.id }));
        if (props.onDeleteAttaCallback) props.onDeleteAttaCallback(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setDeleteLoading(deleteLoading));
  };

  const onUpdate = (id: string, atta: { [k: string]: string | number | boolean }) => {
    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/${id}`, atta)
      .then((res: IHttpRes<Attachment>) => {
        // if (res.data?.data) setAttachment(res.data.data);
        setAttachment(res.data.data);
        if (props.onChangeAttaCallback) props.onChangeAttaCallback(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message));
  };

  const onChangeAttachmentField = (field: string, event: React.FormEvent<HTMLInputElement>) => {
    const v = event.currentTarget.value;

    // @ts-ignore
    if (attachment[field] === v) return;

    onUpdate(attachment?.id, { [field]: v });
  };

  const onChangeStatus = (v: number | boolean) => {
    onUpdate(attachment?.id, { status: Number(v) });
  };

  const coreAttachmentDom = (
    <>
      <div className={cx(style['toolbar'])} style={{ height: cardHeight }}>
        <ConfirmDeleteButton loading={deleteLoading} onClick={() => onDelete(props.attachment?.id)} />
      </div>

      <div
        className={cx(style['image'], {
          [style['imageCircle']]: props.circle,
        })}
        style={{ height: cardHeight }}
      >
        <Popover
          overlayClassName={style['imageTooltip']}
          trigger={['click']}
          title={
            // @ts-ignore
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={`${formatAttaUrl(props.attachment?.url)}`} target="_blank">
              <img alt={props.attachment?.alt} src={`${formatAttaUrl(props.attachment?.url)}`} />
            </a>
          }
        >
          <RiZoomInLine className={style['zoomimage']} />
        </Popover>

        {props.attachment?.at2x === 1 && <RiHdLine title="@2x image" className={style['at2xdot']} />}

        <img src={`${formatAttaUrl(props.attachment?.url)}`} alt="" />
      </div>
    </>
  );

  const innerDom = () => {
    if (props.type === 'card')
      return (
        <div
          className={cx(style['attachmentItemWrapper'], style['wrapperItemCard'], {
            [style['wrapperItemCircle']]: props.circle,
          })}
        >
          {coreAttachmentDom}
        </div>
      );

    if (props.type === 'list')
      return (
        <Draggable key={props.attachment?.id} draggableId={props.attachment?.id} index={props.index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={cx(style['attachmentItemWrapper'], style['wrapperItemList'], {
                [style['wrapperItemCircle']]: props.circle,
              })}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              {coreAttachmentDom}

              <div className={style['handler']}>
                <Input className={style['sort']} value={attachment?.sort} disabled placeholder={t('_lang:sort')} />
              </div>

              <Input
                className={style['title']}
                defaultValue={attachment?.title}
                onBlur={(e) => onChangeAttachmentField('title', e)}
                onPressEnter={(e) => onChangeAttachmentField('title', e)}
                placeholder={t('_lang:title')}
              />

              <Input
                className={style['link']}
                defaultValue={attachment?.link || undefined}
                onBlur={(e) => onChangeAttachmentField('link', e)}
                onPressEnter={(e) => onChangeAttachmentField('link', e)}
                placeholder={t('_lang:link')}
              />

              <SwitchNumber className={style['status']} value={attachment?.status} onChange={onChangeStatus} />
            </div>
          )}
        </Draggable>
      );

    return null;
  };

  return innerDom();
};
