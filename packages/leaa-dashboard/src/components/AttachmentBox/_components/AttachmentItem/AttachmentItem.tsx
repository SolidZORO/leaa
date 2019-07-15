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
import { Input, Button } from 'antd';

import { Attachment } from '@leaa/common/entrys';
import { SwitchNumber } from '@leaa/dashboard/components/SwitchNumber';

import style from './style.less';

interface IProps {
  attachment: Attachment;
  index: number;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  onMoveAttachmentCallback: (dragIndex: number, hoverIndex: number) => void;
  onStoponMoveAttachmentCallback: (dragging: boolean) => void;
  onChangeAttachmentCallback: (attachment: Attachment) => void;
}

interface IAttachmentInstance {
  getNode(): HTMLDivElement | null;
}

const AttachmentItemInner = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const opacity = props.isDragging ? 0.3 : 1;
  const elementRef = useRef(null);

  props.connectDragSource(elementRef);
  props.connectDropTarget(elementRef);

  useImperativeHandle<{}, IAttachmentInstance>(ref, () => ({
    getNode: () => elementRef.current,
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
  };

  if (props.onChangeAttachmentCallback) {
    props.onChangeAttachmentCallback(attachment);
  }

  return (
    <div className={style['wrapper']} ref={elementRef} style={{ ...style, opacity }}>
      <div className={style['image']}>
        <img src={`${process.env.API_HOST}${props.attachment.path}`} alt="" />

        <div className={style['toolbar']}>
          <Button
            type="dashed"
            size="small"
            shape="circle"
            icon="delete"
            className={style['delete']}
            // loading={createArticleMutation.loading}
            // onClick={onSubmit}
          />
        </div>
      </div>
      <Input className={style['title']} value={attachment.title} onChange={e => onChangeAttachment('title', e)} />
      <Input className={style['link']} value={attachment.link} onChange={e => onChangeAttachment('link', e)} />
      <Input className={style['sort']} value={attachment.sort} onChange={e => onChangeAttachment('sort', e)} />
      <SwitchNumber className={style['status']} value={props.attachment.status} onChange={onChangeStatus} />
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
      beginDrag: (props: IProps) => ({
        id: props.attachment.id,
        index: props.index,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(AttachmentItemInner),
);
