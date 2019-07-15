import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { Attachment } from '@leaa/common/entrys';
import { IAttachmentParams } from '@leaa/common/interfaces';
import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

import style from './style.less';

interface IProps {
  attachmentParams: IAttachmentParams;
  value?: number | string | undefined;
  attachments?: Attachment[];
  onChange?: (checked: boolean) => void;
  onChangeAttachmentsCallback?: (attachments: Attachment[]) => void;
  onDeleteAttachmentCallback?: (uuid: string) => void;
}

export const AttachmentList = forwardRef((props: IProps, ref: React.Ref<any>) => {
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
        console.log('>>>> onStopMoveAttachment', nextAttachments);

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

  return (
    <div className={style['wrapper']} ref={ref}>
      <DndProvider backend={HTML5Backend}>
        {attachments &&
          attachments.map((a, i) => (
            <AttachmentItem
              key={a.uuid}
              index={i}
              attachment={a}
              onMoveAttachmentCallback={onMoveAttachment}
              onStoponMoveAttachmentCallback={onStopMoveAttachment}
              onChangeAttachmentCallback={onChangeAttachment}
              onDeleteAttachmentCallback={props.onDeleteAttachmentCallback}
            />
          ))}
      </DndProvider>
    </div>
  );
});
