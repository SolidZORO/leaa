import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import BraftEditor, { EditorState, BraftEditorProps } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import HeaderId from 'braft-extensions/dist/header-id';
import { authUtil } from '@leaa/dashboard/utils';
import { IMediaItem } from '@leaa/common/interfaces';
import { Attachment } from '@leaa/common/entrys';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/code-highlighter.css';

import style from './style.less';

interface IProps {
  attachmentParams: Pick<
    CreateAttachmentInput,
    'type' | 'userId' | 'moduleId' | 'moduleName' | 'moduleType' | 'userId'
  >;
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

export const WYSIWYGEditor = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [content, setContent] = useState<EditorState>(
    BraftEditor.createEditorState(props.content) || BraftEditor.createEditorState(null),
  );

  useEffect(() => {
    setContent(BraftEditor.createEditorState(props.content));
  }, [props.content]);

  //

  const attachmentToMedia = (attachment: Attachment): IMediaItem => ({
    id: attachment.uuid,
    type: attachment.type.toUpperCase(),
    url: `${process.env.API_HOST}${attachment.path}`,
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

  // const onSave = (editorState: EditorState) => {
  //   setContent(editorState);
  //
  //   if (props.onSave) {
  //     props.onSave();
  //   }
  // };

  const uploadFn = (param: any) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const token = authUtil.getAuthToken();

    const onSuccess = (event: ProgressEvent) => {
      console.log('Success >>>>', event);

      if (xhr.response) {
        const response: { attachment: Attachment } = JSON.parse(xhr.response);
        const url = `${process.env.API_HOST}${response.attachment.path}`;
        param.success({ url });
      }
    };

    const onProgress = (event: ProgressEvent) => {
      param.progress((event.loaded / event.total) * 100);
    };

    const onError = (event: ProgressEvent) => {
      console.log('Error >>>>', event);
    };

    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.addEventListener('load', onSuccess, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onError, false);

    _.map(props.attachmentParams, (v, k) => fd.append(`${k}`, `${v}`));

    fd.append('file', param.file);
    xhr.open('POST', `${process.env.UPLOAD_ENDPOINT}`, true);
    xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
    xhr.send(fd);
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
      controls={controls}
      media={{ uploadFn, items: mediaItems }}
      hooks={{ 'remove-medias': onRemoveMedias, 'open-braft-finder': onOpenBraftFinder }}
      {...props.braftEditorProps}
    />
  );
});
