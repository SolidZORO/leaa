import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DndProvider } from 'react-dnd';
import cx from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

import { Attachment } from '@leaa/common/entrys';
import { IAttachmentParams } from '@leaa/common/interfaces';
import { langUtil } from '@leaa/dashboard/utils';

import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

import style from './style.less';

interface IProps {
  attachmentParams: IAttachmentParams;
  value?: number | string | undefined;
  attachments?: Attachment[];
  onChange?: (checked: boolean) => void;
  onChangeAttachmentsCallback?: (attachments: Attachment[]) => void;
  onDeleteAttachmentCallback?: (uuid: string) => void;
  listHeight?: number;
}

export const AttachmentList = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t, i18n } = useTranslation();

  const [attachments, setAttachments] = useState<Attachment[] | undefined>(props.attachments);

  useImperativeHandle<{}, any>(
    ref,
    () => ({
      attachments,
    }),
    [attachments],
  );

  useEffect(() => {
    setAttachments(props.attachments);
  }, [props.attachments]);

  const onMoveAttachment = (dragIndex: number, hoverIndex: number) => {
    if (attachments) {
      const dragCard = attachments[dragIndex];

      setAttachments(
        update(attachments, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }),
      );
    }
  };

  const onStopMoveAttachment = (isStopMove: boolean) => {
    if (isStopMove) {
      if (attachments && attachments.length > 0) {
        const nextAttachments = attachments.map((a, i) => ({ ...a, sort: i + 1 }));
        setAttachments(nextAttachments);

        if (props.onChangeAttachmentsCallback) {
          props.onChangeAttachmentsCallback(nextAttachments);
        }
      }
    }
  };

  const onChangeAttachment = (newAttachment: any) => {
    if (attachments && attachments.length > 0) {
      const aIndex = attachments.findIndex(a => a.uuid === newAttachment.uuid);

      if (typeof aIndex !== 'undefined') {
        attachments[aIndex] = newAttachment;
        setAttachments(attachments);
      }
    }
  };

  const onChangeStatus = async (attachment: any) => {
    await onChangeAttachment(attachment);

    if (attachments && attachments.length > 0 && props.onChangeAttachmentsCallback) {
      await props.onChangeAttachmentsCallback(attachments);
    }
  };

  const isEmpty = attachments && attachments.length === 0;

  return (
    <div
      className={cx(style['wrapper'], { [style['wrapper--empty']]: isEmpty })}
      style={{
        height: props.listHeight || 230,
        paddingTop: isEmpty && props.listHeight ? props.listHeight / 2 - 10 : undefined,
      }}
      ref={ref}
    >
      <div className={style['wrapper-inner']}>
        <DndProvider backend={HTML5Backend}>
          {attachments && !isEmpty ? (
            attachments.map((a, i) => (
              <AttachmentItem
                key={a.uuid}
                index={i}
                attachment={a}
                onMoveAttachmentCallback={onMoveAttachment}
                onStoponMoveAttachmentCallback={onStopMoveAttachment}
                onChangeAttachmentCallback={onChangeAttachment}
                onDeleteAttachmentCallback={props.onDeleteAttachmentCallback}
                onChangeStatusCallback={onChangeStatus}
              />
            ))
          ) : (
            <div className={style['empty-text']}>
              {langUtil.removeSpace(`${t('_lang:empty')} ${t('_lang:attachment')}`, i18n.language)}
            </div>
          )}
        </DndProvider>
      </div>
    </div>
  );
});
