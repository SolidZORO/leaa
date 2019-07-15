import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { Attachment } from '@leaa/common/entrys';
import { IAttachmentParams } from '@leaa/common/interfaces';
import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

import style from './style.less';

interface IProps {
  value?: number | string | undefined;
  attachments?: Attachment[];
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
}

export const AttachmentList = (props: IProps) => {
  const [attachments, setAttachments] = useState(props.attachments);

  useEffect(() => {
    setAttachments(props.attachments);
  }, [props.attachments]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (attachments) {
      const dragCard = attachments[dragIndex];

      setAttachments(
        update(attachments, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }),
      );
    }
  };

  const stopMoveCard = (isStopMove: boolean) => {
    if (isStopMove) {
      console.log('STOP', attachments);
    }
  };

  return (
    <div className={style['wrapper']}>
      <DndProvider backend={HTML5Backend}>
        {attachments &&
          attachments.map((a, i) => (
            <AttachmentItem
              key={a.uuid}
              index={i}
              attachment={a}
              moveCardCallback={moveCard}
              stopMoveCardCallback={stopMoveCard}
            />
          ))}
      </DndProvider>
    </div>
  );
};
