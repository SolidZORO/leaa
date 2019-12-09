import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { Rcon } from '@leaa/dashboard/src/components';
// import { Icon } from 'antd';

// import { MessageOutlined, createFromIconfontCN } from '@ant-design/icons';

export default (props: IPage) => {
  return (
    <div>
      <h2>TestAnyWithoutLayout</h2>
      <Rcon type="ri-function-line" />
    </div>
  );
};
