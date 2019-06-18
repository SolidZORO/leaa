import React from 'react';
import { LocaleProvider, Tag, Switch } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';

export const App = () => (
  <LocaleProvider locale={zhCN}>
    <div>
      <h1>Hello Leaa!</h1>
      <Tag>v1</Tag>
      <Switch size="small" defaultChecked />
    </div>
  </LocaleProvider>
);
