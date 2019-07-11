import React, { useState, useEffect } from 'react';
import BraftEditor, { BuiltInControlType, EditorState, BraftEditorProps } from 'braft-editor';

import 'braft-editor/dist/index.css';

interface IProps {
  content?: string;
  braftEditorProps?: BraftEditorProps;
}

export const WYSIWYGEditor = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const controls: any[] = [
    'undo',
    'redo',
    'separator',
    'font-size',
    'line-height',
    'letter-spacing',
    'separator',
    'text-color',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'superscript',
    'subscript',
    'remove-styles',
    'emoji',
    'separator',
    // 'text-indent',
    // 'text-align',
    'separator',
    'headings',
    'list-ul',
    'list-ol',
    'blockquote',
    'code',
    'separator',
    'link',
    'separator',
    'hr',
    'separator',
    'media',
    'separator',
    'clear',
  ];

  const [content, setContent] = useState<EditorState>(
    BraftEditor.createEditorState(props.content) || BraftEditor.createEditorState(null),
  );

  useEffect(() => {
    setContent(BraftEditor.createEditorState(props.content));
  }, [props.content]);

  const onChange = (editorState: EditorState) => {
    setContent(editorState);
  };

  const onSave = (editorState: EditorState) => {
    setContent(editorState);
  };

  return (
    <BraftEditor
      ref={ref}
      value={content}
      onChange={onChange}
      onSave={onSave}
      controls={controls}
      {...props.braftEditorProps}
    />
  );
});
