import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Attachment } from '@leaa/common/src/entrys';
import { IAttachmentParams } from '@leaa/common/src/interfaces';
import { removeLangSpace } from '@leaa/dashboard/src/utils';

import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

import style from './style.module.less';

interface IProps {
  attachments?: Attachment[];
  attachmentParams?: IAttachmentParams;
  value?: number | string | undefined;
  onChange?: (checked: boolean) => void;
  onChangeAttasCallback?: (attachments: Attachment[]) => void;
  onDeleteAttaCallback?: (attachment: Attachment) => void;
  listHeight?: number;
  type?: 'list' | 'card';
  cardHeight?: number;
  circle?: boolean;
}

const getListStyle = (isDraggingOver: boolean) => ({
  borderRadius: '3px',
  backgroundColor: isDraggingOver ? '#f9f9f9' : 'transparent',
});

export const AttachmentList = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  useEffect(() => {
    if (props.attachments) setAttachments(props.attachments);
  }, [props.attachments]);

  const reOrder = (list: Attachment[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((a, i) => ({ ...a, sort: i + 1 } as Attachment));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const nextAttachments = reOrder(attachments, result.source.index, result.destination.index);
    setAttachments(nextAttachments);

    if (props.onChangeAttasCallback) props.onChangeAttasCallback(nextAttachments);
  };

  const onChangeAtta = (atta: Attachment) => {
    const nextAttas = attachments;
    const i = attachments.findIndex((a) => a.id === atta.id);
    nextAttas.splice(i, 1, atta);

    setAttachments(nextAttas);
  };

  const coreAttachmentsDom = attachments.map((atta, index) => (
    <AttachmentItem
      key={atta.id}
      index={index}
      attachment={atta}
      onDeleteAttaCallback={props.onDeleteAttaCallback}
      onChangeAttaCallback={onChangeAtta}
      type={props.type}
      cardHeight={props.cardHeight}
      circle={props.circle}
    />
  ));

  const innerDom = () => {
    if (_.isEmpty(attachments))
      return (
        <div className={style['empty-text']}>
          {removeLangSpace(`${t('_lang:empty')} ${t('_lang:attachment')}`, i18n.language)}
        </div>
      );

    if (props.type === 'card') return coreAttachmentsDom;
    if (props.type === 'list')
      return (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {coreAttachmentsDom}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );

    return null;
  };

  return (
    <div
      className={cx(style['attachment-list-wrapper'], {
        [style['wrapper-list--list']]: props.type === 'list',
        [style['wrapper-list--card']]: props.type === 'card',
        [style['wrapper-list--circle']]: props.circle,
        [style['wrapper-list--empty']]: _.isEmpty(attachments),
      })}
      style={{ height: props.type === 'list' ? props.listHeight : undefined }}
    >
      <div className={style['attachment-list-wrapper-inner']}>{innerDom()}</div>
    </div>
  );
};
