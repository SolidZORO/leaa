import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
import { Attachment, Article } from '@leaa/common/entrys';

import { message } from 'antd';
import { SwitchNumber } from '@leaa/dashboard/components/SwitchNumber';
import { AttachmentForm } from '../AttachmentForm/AttachmentForm';

import style from './style.less';

interface IProps {
  attachment: Attachment;
  index: number;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  moveCardCallback: (dragIndex: number, hoverIndex: number) => void;
  stopMoveCardCallback: (dragging: boolean) => void;
}

interface CardInstance {
  getNode(): HTMLDivElement | null;
}

const AttachmentItemInner = forwardRef<HTMLDivElement, IProps>((props: IProps, ref: React.Ref<any>) => {
  let attachmentFormRef: any;

  const elementRef = useRef(null);
  props.connectDragSource(elementRef);
  props.connectDropTarget(elementRef);

  const opacity = props.isDragging ? 0.3 : 1;

  useImperativeHandle<{}, CardInstance>(ref, () => ({
    getNode: () => elementRef.current,
  }));

  // console.log(attachmentFormRef);

  // attachmentFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
  //   if (err) {
  //     message.error(err[Object.keys(err)[0]].errors[0].message);
  //   }
  //
  //   console.log(formData);
  //
  //   // submitData = formData;
  // });

  return (
    <div className={style['wrapper']} ref={elementRef} style={{ ...style, opacity }}>
      {props.attachment.title}
      <img width="40" src={`${process.env.API_HOST}${props.attachment.path}`} alt="" />
      <SwitchNumber value={props.attachment.status} />

      {/* <AttachmentForm */}
      {/*  attachment={props.attachment} */}
      {/*  wrappedComponentRef={(inst: unknown) => { */}
      {/*    attachmentFormRef = inst; */}
      {/*  }} */}
      {/* /> */}
    </div>
  );
});

export const AttachmentItem = DropTarget(
  'card',
  {
    hover(props: IProps, monitor: DropTargetMonitor, component: CardInstance) {
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

      props.stopMoveCardCallback(false);
      props.moveCardCallback(dragIndex, hoverIndex);

      // eslint-disable-next-line no-param-reassign
      monitor.getItem().index = hoverIndex;
    },
    drop(props: IProps) {
      props.stopMoveCardCallback(true);
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
