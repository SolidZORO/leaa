import cx from 'classnames';
import i18n from 'i18next';
import React, { useState, useEffect, forwardRef } from 'react';
import BraftEditor, { EditorState, BraftEditorProps } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import HeaderId from 'braft-extensions/dist/header-id';
import { attachmentUtil } from '@leaa/dashboard/src/utils';
import { IMediaItem, IAttachmentParams } from '@leaa/common/src/interfaces';
import { Attachment } from '@leaa/common/src/entrys';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/code-highlighter.css';

import style from './style.less';

interface IProps {
  attachmentParams: IAttachmentParams;
  attachmentItems?: Attachment[];
  content?: string;
  braftEditorProps?: BraftEditorProps;
  className?: string;
  onSave?: () => void;
  onRemoveMedias?: (attachments: IMediaItem[]) => void;
  onUploadSuccess?: () => void;
  onOpenBraftFinder?: () => void;
}

const controls: any[] = [
  'headings',
  'separator',
  //
  'text-color',
  'strike-through',
  'list-ul',
  'list-ol',
  'blockquote',
  'table',
  'code',
  'remove-styles',
  'separator',
  //
  'link',
  'hr',
  'separator',
  //
  'media',
];

const codeHighlighterOptions = {
  syntaxs: [
    { name: 'JavaScript', syntax: 'javascript' },
    { name: 'HTML', syntax: 'html' },
    { name: 'CSS', syntax: 'css' },
    { name: 'PHP', syntax: 'php' },
    { name: 'SQL', syntax: 'sql' },
  ],
};

const tableOptions = {
  defaultColumns: 3,
  defaultRows: 5,
  withDropdown: true,
  exportAttrString: '',
};

BraftEditor.use(Table(tableOptions));
BraftEditor.use(CodeHighlighter(codeHighlighterOptions));
BraftEditor.use(HeaderId());

export const WYSIWYGEditor = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [content, setContent] = useState<EditorState>(
    BraftEditor.createEditorState(props.content) || BraftEditor.createEditorState(null),
  );

  useEffect(() => {
    setContent(BraftEditor.createEditorState(props.content));
  }, [props.content]);

  const attachmentToMedia = (attachment: Attachment): IMediaItem => ({
    id: attachment.uuid,
    type: attachment.type.toUpperCase(),
    url: attachment.url || '',
  });

  const attachmentsToMedias = (attachmentItems?: Attachment[]): IMediaItem[] =>
    (attachmentItems && attachmentItems.map(a => attachmentToMedia(a))) || [];

  const [mediaItems, setMediaItems] = useState<IMediaItem[]>(attachmentsToMedias(props.attachmentItems));

  useEffect(() => {
    setMediaItems(attachmentsToMedias(props.attachmentItems));
  }, [props.attachmentItems]);

  const onChange = (editorState: EditorState) => {
    setContent(editorState);
  };

  const uploadFn = async (param: any) => {
    const signature = await attachmentUtil.getSignature();

    await attachmentUtil.uploadFile(param.file, signature, props.attachmentParams, {
      onUploadSuccess: event => {
        if (event && event.data && event.data.attachment && event.data.attachment.url) {
          param.success({ url: event.data.attachment.url });
        }
      },
      onUploadProgress: event => {
        param.progress((event.loaded / event.total) * 100);
      },
      // onUploadFail: event => {
      // },
      // onUploadCatch: event => {
      // },
    });
  };

  const onRemoveMedias = (attachments: IMediaItem[]) => {
    if (props.onRemoveMedias) {
      props.onRemoveMedias(attachments);
    }
  };

  const onOpenBraftFinder = () => {
    if (props.onOpenBraftFinder) {
      props.onOpenBraftFinder();
    }
  };

  return (
    <BraftEditor
      ref={ref}
      value={content}
      className={cx(style['wrapper'], props.className)}
      onChange={onChange}
      // onSave={onSave}
      language={i18n.language === 'zh-CN' ? 'zh' : 'en'}
      controls={controls}
      media={{ uploadFn, items: mediaItems }}
      hooks={{ 'remove-medias': onRemoveMedias, 'open-braft-finder': onOpenBraftFinder }}
      {...props.braftEditorProps}
    />
  );
});
