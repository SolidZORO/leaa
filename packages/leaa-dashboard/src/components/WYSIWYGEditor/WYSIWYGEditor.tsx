import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

interface IProps {
  content?: string;
}

export const WYSIWYGEditor = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [content, setContent] = useState<string | undefined>(props.content || undefined);

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  return <Input.TextArea ref={ref} rows={10} value={content} onChange={onChange} />;
});
