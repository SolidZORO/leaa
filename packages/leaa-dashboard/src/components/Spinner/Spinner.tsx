import React from 'react';
import { Spin } from 'antd';

import style from './style.module.less';

export const Spinner = () => <Spin className={style['suspense-fallback-loader']} />;
