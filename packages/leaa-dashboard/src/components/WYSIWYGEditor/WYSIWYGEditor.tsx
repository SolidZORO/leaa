import React, { useState, useEffect } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';

import 'braft-editor/dist/index.css';

interface IProps {
  content?: string;
}

export const WYSIWYGEditor = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [content, setContent] = useState<string | undefined>(
    BraftEditor.createEditorState(props.content) || BraftEditor.createEditorState(null),
  );

  useEffect(() => {
    setContent(BraftEditor.createEditorState(props.content));
  }, [props.content]);

  const onChange = (editorState: EditorState) => {
    setContent(editorState);
  };

  const onSave = (editorState: EditorState) => {
    console.log('xxxxxxx', editorState);
  };

  return <BraftEditor ref={ref} value={content} onChange={onChange} onSave={onSave} />;
});
