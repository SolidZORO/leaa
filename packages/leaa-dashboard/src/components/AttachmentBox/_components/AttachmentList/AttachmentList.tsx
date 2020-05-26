import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import cx from 'classnames';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

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

export const AttachmentList = (props: IProps) => {
  const { t, i18n } = useTranslation();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const onMoveAtta = (dragIndex: number, hoverIndex: number) => {
    if (attachments) {
      const dragCard = attachments[dragIndex];

      setAttachments(
        update(attachments, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      );
    }
  };

  const onStopMoveAtta = (isStopMove: boolean) => {
    if (isStopMove) {
      if (!_.isEmpty(attachments)) {
        const nextAttachments = attachments.map((a, i) => ({ ...a, sort: i + 1 } as Attachment));
        setAttachments(nextAttachments);

        if (props.onChangeAttasCallback) props.onChangeAttasCallback(nextAttachments);
      }
    }
  };

  const onChangeAtta = (newAttachment: any) => {
    if (!_.isEmpty(attachments)) {
      const aIndex = attachments.findIndex((a) => a.id === newAttachment.id);

      if (typeof aIndex !== 'undefined') {
        attachments[aIndex] = newAttachment;
        setAttachments(attachments);

        if (props.onChangeAttasCallback) props.onChangeAttasCallback(attachments);
      }
    }
  };

  const dndDom = () => {
    if (!_.isEmpty(attachments)) {
      return attachments.map((atta, i) => (
        <AttachmentItem
          key={atta.id}
          index={i}
          attachment={atta}
          onMoveAttaCallback={onMoveAtta}
          onStopMoveAttaCallback={onStopMoveAtta}
          onChangeAttaCallback={onChangeAtta}
          onDeleteAttaCallback={props.onDeleteAttaCallback}
          type={props.type}
          cardHeight={props.cardHeight}
          circle={props.circle}
        />
      ));
    }

    if (props.type === 'list') {
      return (
        <div className={style['empty-text']}>
          {removeLangSpace(`${t('_lang:empty')} ${t('_lang:attachment')}`, i18n.language)}
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (props.attachments) setAttachments(props.attachments);
  }, [props.attachments]);

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
      <div className={style['attachment-list-wrapper-inner']}>
        <DndProvider backend={HTML5Backend}>{dndDom()}</DndProvider>
      </div>
    </div>
  );
};
