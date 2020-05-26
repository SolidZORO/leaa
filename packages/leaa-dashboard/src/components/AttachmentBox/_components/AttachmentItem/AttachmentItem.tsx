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
import { Input, Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { Attachment } from '@leaa/common/src/entrys';
import { SwitchNumber, Rcon, ConfirmDeleteButton } from '@leaa/dashboard/src/components';
import { ajax, errorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps {
  attachment: Attachment;
  index: number;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  onMoveAttaCallback: (dragIndex: number, hoverIndex: number) => void;
  onStopMoveAttaCallback: (dragging: boolean) => void;
  onChangeAttaCallback: (attachment: Attachment) => void;
  onDeleteAttaCallback?: (attachment: Attachment) => void;
  type?: 'list' | 'card';
  cardHeight?: number;
  circle?: boolean;
}

interface IAttachmentInstance {
  getNode(): HTMLDivElement | null;
}

/**
 * 我淦！react-dnd 相关的代码怎么那么复杂 ？？？？
 * 它不是堪称 react libs 的典范吗？才两个月不看，我都搞不懂之前写的是什么了，又得去翻 docs
 *
 * @ideaNotes
 * 害，此时此刻，我并没有什么想法……
 */
const AttachmentItemInner = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const cardRef = useRef(null);
  const opacity = props.isDragging ? 0.3 : 1;
  const cardHeight = (props.type === 'card' && props.cardHeight) || undefined;

  // just handles <image> sort
  props.connectDragSource(cardRef);
  props.connectDropTarget(cardRef);

  const [attachment, setAttachment] = useState<Attachment>(props.attachment);

  const onChangeAttachmentField = (field: string, event: React.FormEvent<HTMLInputElement>) => {
    const v = event.currentTarget.value;

    // @ts-ignore
    if (attachment[field] === v) return;

    const nextAtta = { ...attachment, [field]: v } as Attachment;

    setAttachment(nextAtta);
    props.onChangeAttaCallback(nextAtta);
  };

  const onChangeStatus = (v: number | boolean) => {
    const nextAtta = { ...attachment, status: Number(v) } as Attachment;

    setAttachment(nextAtta);
    props.onChangeAttaCallback(nextAtta);
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDelete = (id?: string) => {
    setDeleteLoading(true);

    ajax
      .delete(`${envConfig.API_URL}/${envConfig.API_VERSION}/attachments/${id}`)
      .then((res: IHttpRes<Attachment>) => {
        // msg(t('_lang:deletedSuccessfully', { id: res?.data?.data?.id }));
        if (props.onDeleteAttaCallback) props.onDeleteAttaCallback(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setDeleteLoading(deleteLoading));
  };

  useEffect(() => setAttachment(props.attachment), [props.attachment]);

  useImperativeHandle<{}, IAttachmentInstance>(ref, () => ({ getNode: () => cardRef.current }));

  return (
    <div
      ref={ref}
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
            <a href={props.attachment?.url} target="_blank">
              <img alt={props.attachment?.alt} src={`${props.attachment?.url}`} />
            </a>
          }
        >
          <Rcon type="ri-eye-line" className={style['zoomimage']} />
        </Popover>

        {props.attachment?.at2x === 1 && <Rcon type="ri-hd-line" title="@2x image" className={style['at2xdot']} />}

        <img src={`${props.attachment?.url}`} alt="" />
      </div>

      {props.type === 'list' && (
        <>
          <div ref={cardRef} className={style['handler']}>
            <Input
              className={style['sort']}
              value={attachment?.sort}
              disabled
              // onBlur={(e) => onChangeAttachmentField('sort', e)}
              // defaultValue={attachment?.sort}
              // onChange={(e) => onChangeAttachmentField('sort', e)}
              // onPressEnter={(e) => onChangeAttachmentField('sort', e)}
              placeholder={t('_lang:sort')}
            />
          </div>

          <Input
            className={style['title']}
            // value={attachment?.title}
            defaultValue={attachment?.title}
            onBlur={(e) => onChangeAttachmentField('title', e)}
            onPressEnter={(e) => onChangeAttachmentField('title', e)}
            // onChange={(e) => onChangeAttachmentField('title', e)}
            placeholder={t('_lang:title')}
          />

          <Input
            className={style['link']}
            // value={attachment?.link || undefined}
            defaultValue={attachment?.link || undefined}
            onBlur={(e) => onChangeAttachmentField('link', e)}
            onPressEnter={(e) => onChangeAttachmentField('link', e)}
            // onChange={(e) => onChangeAttachmentField('link', e)}
            placeholder={t('_lang:link')}
          />

          <SwitchNumber className={style['status']} value={attachment?.status} onChange={onChangeStatus} />
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

      props.onStopMoveAttaCallback(false);
      props.onMoveAttaCallback(dragIndex, hoverIndex);

      // eslint-disable-next-line no-param-reassign
      monitor.getItem().index = hoverIndex;
    },
    drop(props: IProps) {
      props.onStopMoveAttaCallback(true);
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
          id: props.attachment?.id,
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
