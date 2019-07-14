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

import style from './style.less';

interface IProps {
  value: string;
  id: any;
  text: string;
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
  const elementRef = useRef(null);
  props.connectDragSource(elementRef);
  props.connectDropTarget(elementRef);

  const opacity = props.isDragging ? 0 : 1;
  useImperativeHandle<{}, CardInstance>(ref, () => ({
    getNode: () => elementRef.current,
  }));
  return (
    <div className={style['wrapper']} ref={elementRef} style={{ ...style, opacity }}>
      {props.value}
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
        id: props.id,
        index: props.index,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(AttachmentItemInner),
);
