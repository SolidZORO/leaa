import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import BraftEditor, { EditorState, BraftEditorProps, MediaType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import HeaderId from 'braft-extensions/dist/header-id';
import { authUtil } from '@leaa/dashboard/utils';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/code-highlighter.css';

import style from './style.less';

interface IProps {
  attachmentParams: Pick<CreateAttachmentInput, 'userId' | 'moduleId' | 'moduleName' | 'moduleType' | 'userId'>;
  content?: string;
  braftEditorProps?: BraftEditorProps;
  className?: string;
  onSave?: () => void;
}

const controls: any[] = [
  // 'undo',
  // 'redo',
  // 'separator',
  'headings',
  // 'font-size',
  // 'line-height',
  // 'letter-spacing',
  'separator',
  'text-color',
  // 'bold',
  // 'italic',
  // 'underline',
  'strike-through',
  // 'superscript',
  // 'subscript',
  'list-ul',
  'list-ol',
  'blockquote',
  'table',
  'code',
  'remove-styles',
  // 'emoji',
  // 'separator',
  // 'text-indent',
  // 'text-align',
  // 'separator',
  'separator',
  'link',
  'hr',
  'separator',
  'media',
  // 'separator',
  // 'clear',
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
  defaultRows: 3,
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
  //

  useEffect(() => {
    setContent(BraftEditor.createEditorState(props.content));
  }, [props.content]);

  const onChange = (editorState: EditorState) => {
    setContent(editorState);
  };

  const onSave = (editorState: EditorState) => {
    setContent(editorState);

    if (props.onSave) {
      props.onSave();
    }
  };

  const uploadFn = (param: any) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const token = authUtil.getAuthToken();

    const onSuccess = (event: ProgressEvent) => {
      console.log('onSuccess', event);

      param.success({
        url: xhr.responseText,
        meta: {
          loop: true,
        },
      });

      // param.success(res => {
      //   console.log(res);
      // });
    };

    const onProgress = (event: ProgressEvent) => {
      console.log('onProgress', event);
      // param.progress((event.loaded / event.total) * 100);
    };

    const onError = (event: ProgressEvent) => {
      // console.log('onError', event);
      //
      // // message.destroy();
      // message.error('上传失败');
      //
      // param.error({
      //   msg: 'unable to upload.',
      // });
    };

    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.addEventListener('load', onSuccess, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onError, false);

    fd.append('file', param.file);

    _.map(props.attachmentParams, (v, k) => fd.append(`${k}`, `${v}`));

    xhr.open('POST', `${process.env.UPLOAD_HOST}`, true);

    xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
    xhr.send(fd);
  };

  return (
    <BraftEditor
      ref={ref}
      value={content}
      className={cx(style['wrapper'], props.className)}
      onChange={onChange}
      onSave={onSave}
      controls={controls}
      media={{ uploadFn }}
      {...props.braftEditorProps}
    />
  );
});
