import _ from 'lodash';
import axios from 'axios';
import cx from 'classnames';
import i18n from 'i18next';
import React, { useState, useEffect, forwardRef } from 'react';
import { message } from 'antd';
import BraftEditor, { EditorState, BraftEditorProps } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import HeaderId from 'braft-extensions/dist/header-id';
import { authUtil, attachmentUtil } from '@leaa/dashboard/utils';
import { IMediaItem, IAttachmentParams } from '@leaa/common/interfaces';
import { Attachment } from '@leaa/common/entrys';
import { envConfig } from '@leaa/dashboard/configs';

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
    url: `${envConfig.API_HOST}${attachment.path}`,
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
    // const a = await attachmentUtil.batchUploadFiles([param.file], props);

    const a = await attachmentUtil.uploadFile(
      param.file,
      signature,
      props.attachmentParams,
      {
        onUploadSuccess: e => {
          console.log(e);
        },
      },
      // () => props.onUploadedCallback && props.onUploadedCallback(new Date().getMilliseconds()),
      // (e) => param.success({ url }),
      // e => {
      //   console.log(e);
      // },
    );

    console.log(a);
    //
    //
    // const token = authUtil.getAuthToken();
    // const formData = new FormData();
    // formData.append('file', param.file);
    // _.map(props.attachmentParams, (v, k) => formData.append(`${k}`, `${v}`));
    //
    // await axios
    //   .post(`${envConfig.UPLOAD_ENDPOINT}`, formData, {
    //     headers: { Authorization: token ? `Bearer ${token}` : '' },
    //     onUploadProgress: event => {
    //       param.progress((event.loaded / event.total) * 100);
    //     },
    //   })
    //   .then(e => {
    //     if (e.data && e.data.attachment) {
    //       const url = `${envConfig.API_HOST}${e.data.attachment.path}`;
    //       param.success({ url });
    //     }
    //   })
    //   .catch((e: Error) => {
    //     message.info(e.message);
    //   });
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
