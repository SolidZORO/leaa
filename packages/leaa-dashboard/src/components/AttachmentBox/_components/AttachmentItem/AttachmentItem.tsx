import cx from 'classnames';
import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor,
  DropTargetConnector,
  DragSourceConnector,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { Input, Tooltip } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { DELETE_ATTACHMENT } from '@leaa/dashboard/src/graphqls';
import { Attachment } from '@leaa/common/src/entrys';
import { SwitchNumber, Rcon, ConfirmDeleteButton } from '@leaa/dashboard/src/components';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  attachment: Attachment;
  index: number;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  onMoveAttachmentCallback: (dragIndex: number, hoverIndex: number) => void;
  onStoponMoveAttachmentCallback: (dragging: boolean) => void;
  onChangeAttachmentCallback: (attachment: Attachment) => void;
  onDeleteAttachmentCallback?: (uuid: string) => void;
  onChangeStatusCallback?: (attachment: Attachment) => void;
  type?: 'list' | 'card';
  cardHeight?: number;
  circle?: boolean;
}

interface IAttachmentInstance {
  getNode(): HTMLDivElement | null;
}

const AttachmentItemInner = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const opacity = props.isDragging ? 0.3 : 1;
  const cardHeight = (props.type === 'card' && props.cardHeight) || undefined;

  // TODO just handles <image> sort
  props.connectDragSource(cardRef);
  props.connectDropTarget(cardRef);

  useImperativeHandle<{}, IAttachmentInstance>(ref, () => ({
    getNode: () => cardRef.current,
  }));

  const [attachment, setAttachment] = useState<Attachment>(props.attachment);
  useEffect(() => setAttachment(props.attachment), [props.attachment]);

  const onChangeAttachment = (field: string, event: React.FormEvent<HTMLInputElement>) => {
    setAttachment({
      ...attachment,
      [field]: event.currentTarget.value,
    });
  };

  const onChangeStatus = (v: number | boolean) => {
    setAttachment({
      ...attachment,
      status: Number(v),
    });

    if (props.onChangeStatusCallback) {
      props.onChangeStatusCallback(attachment);
    }
  };

  if (props.onChangeAttachmentCallback) {
    props.onChangeAttachmentCallback(attachment);
  }

  const [deleteAttachmentsVariables, setDeleteAttachmentsVariables] = useState<{ uuid: string[] }>();
  const [deleteAttachmentsMutate, deleteAttachmentsMutation] = useMutation<{ uuid: string[] }>(DELETE_ATTACHMENT, {
    variables: deleteAttachmentsVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgMessage(t('_lang:deletedSuccessfully')),
  });

  const onDelete = async (uuid: string) => {
    await setDeleteAttachmentsVariables({ uuid: [uuid] });
    await deleteAttachmentsMutate();

    if (props.onDeleteAttachmentCallback) {
      props.onDeleteAttachmentCallback(uuid);
    }
  };

  return (
    <div
      className={cx(style['attachmentItemWrapper'], {
        // Fucking!! Warning: Unsupported style property wrapperItem-card. Did you mean wrapperItemCard?
        [style['wrapperItemList']]: props.type === 'list',
        [style['wrapperItemCard']]: props.type === 'card',
        [style['wrapperItemCircle']]: props.circle,
      })}
      style={{
        ...style,
        // stylelint-disable-line
        opacity,
      }}
    >
      <div className={cx(style['toolbar'])} ref={cardRef} style={{ height: cardHeight }}>
        <ConfirmDeleteButton loading={deleteAttachmentsMutation.loading} onClick={() => onDelete(attachment.uuid)} />
      </div>

      <div
        ref={cardRef}
        className={cx(style['image'], {
          [style['imageCircle']]: props.circle,
        })}
        style={{ height: cardHeight }}
      >
        <Tooltip
          overlayClassName={style['imageTooltip']}
          title={
            // @ts-ignore
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={props.attachment.url} target="_blank">
              <img alt={props.attachment.alt} src={`${props.attachment.url}`} />
            </a>
          }
        >
          <Rcon type="ri-eye-line" className={style['zoomimage']} />
        </Tooltip>

        {props.attachment.at2x === 1 && <Rcon type="ri-hd-line" title="@2x image" className={style['at2xdot']} />}

        <img src={`${props.attachment.url}`} alt="" />
      </div>

      {props.type === 'list' && (
        <>
          <Input
            className={style['title']}
            value={attachment.title}
            onChange={(e) => onChangeAttachment('title', e)}
            placeholder={t('_lang:title')}
          />

          <Input
            className={style['link']}
            value={attachment.link || undefined}
            onChange={(e) => onChangeAttachment('link', e)}
            placeholder={t('_lang:link')}
          />

          <Input
            className={style['sort']}
            value={attachment.sort}
            onChange={(e) => onChangeAttachment('sort', e)}
            placeholder={t('_lang:sort')}
          />

          <SwitchNumber className={style['status']} value={props.attachment.status} onChange={onChangeStatus} />
        </>
      )}
    </div>
  );
});

export const AttachmentItem = DropTarget(
  'card',
  {
    hover(props: IProps, monitor: DropTargetMonitor, component: IAttachmentInstance) {
      if (!component) {
        return;
      }

      const node = component.getNode();

      if (!node) {
        return;
      }

      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.onStoponMoveAttachmentCallback(false);
      props.onMoveAttachmentCallback(dragIndex, hoverIndex);

      // eslint-disable-next-line no-param-reassign
      monitor.getItem().index = hoverIndex;
    },
    drop(props: IProps) {
      props.onStoponMoveAttachmentCallback(true);
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    'card',
    {
      beginDrag: (props: IProps) => {
        if (props.type === 'card') {
          return undefined;
        }

        return {
          id: props.attachment.id,
          index: props.index,
        };
      },
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(AttachmentItemInner),
);
